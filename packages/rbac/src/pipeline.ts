import type { CacheService } from '@repo/cache';
import { CACHE_KEYS, CACHE_TTL } from '@repo/shared';
import type { PrismaClient } from '@repo/db-mysql';
import type { PolicyEngine } from './policy-engine.js';
import type { AuthorizationResult, PolicyContext, PermissionSet } from './types.js';

interface PipelineConfig {
  prisma: PrismaClient;
  cache: CacheService;
  policyEngine: PolicyEngine;
}

/**
 * 6-Step Authorization Pipeline:
 * 1. Authenticate (JWT - handled before this runs)
 * 2. Load user roles
 * 3. Load role permissions
 * 4. Merge direct user permission overrides
 * 5. Tenant isolation check
 * 6. Policy rules (ownership, state, time, department)
 *
 * FAIL FAST: any step failure immediately returns 403.
 */
export class AuthorizationPipeline {
  private prisma: PrismaClient;
  private cache: CacheService;
  private policyEngine: PolicyEngine;

  constructor(config: PipelineConfig) {
    this.prisma = config.prisma;
    this.cache = config.cache;
    this.policyEngine = config.policyEngine;
  }

  async authorize(
    userId: string,
    tenantId: string,
    permission: string,
    resource?: string,
    resourceData?: Record<string, unknown>,
  ): Promise<AuthorizationResult> {
    // Step 2: Load user roles
    const roles = await this.loadUserRoles(userId, tenantId);
    if (roles.length === 0) {
      return { allowed: false, reason: 'No roles assigned', step: 'load_roles' };
    }

    // Step 3 + 4: Load merged permissions (role perms + direct overrides)
    const permissionSet = await this.loadMergedPermissions(userId, tenantId, roles);

    // Check if explicitly denied
    if (permissionSet.denied.has(permission)) {
      return { allowed: false, reason: 'Permission explicitly denied', step: 'merge_permissions' };
    }

    // Check if granted
    if (!permissionSet.granted.has(permission)) {
      const hasManage =
        permission.includes('.') && permissionSet.granted.has(`${permission.split('.')[0]}.manage`);
      if (!hasManage) {
        return { allowed: false, reason: 'Permission not granted', step: 'check_permission' };
      }
    }

    // Step 5: Tenant isolation
    if (resourceData && resourceData['tenantId'] && resourceData['tenantId'] !== tenantId) {
      return { allowed: false, reason: 'Cross-tenant access denied', step: 'tenant_isolation' };
    }

    // Step 6: Policy rules
    if (resource) {
      const userDept = await this.getUserDepartment(userId, tenantId);
      const ctx: PolicyContext = {
        user: {
          id: userId,
          tenantId,
          permissions: permissionSet.granted,
          roles: roles.map((r) => r.slug),
          departmentId: userDept ?? undefined,
        },
        resource: resourceData,
        action: permission.split('.')[1] ?? permission,
        tenantId,
      };

      const policyResult = await this.policyEngine.evaluate(resource, ctx.action, ctx);
      if (!policyResult.allowed) {
        return policyResult;
      }
    }

    return { allowed: true, step: 'authorized' };
  }

  private async loadUserRoles(userId: string, tenantId: string) {
    const cacheKey = `roles:user:${tenantId}:${userId}`;
    const cached = await this.cache.get<{ id: string; slug: string }[]>(cacheKey);
    if (cached) return cached;

    const roleUsers = await this.prisma.roleUser.findMany({
      where: { userId, tenantId },
      include: { role: { select: { id: true, slug: true } } },
    });

    const roles = roleUsers.map((ru) => ru.role);
    await this.cache.set(cacheKey, roles, CACHE_TTL.USER_PERMISSIONS);
    return roles;
  }

  private async loadMergedPermissions(
    userId: string,
    tenantId: string,
    roles: { id: string; slug: string }[],
  ): Promise<PermissionSet> {
    const cacheKey = CACHE_KEYS.userPermissions(tenantId, userId);
    const cached = await this.cache.get<{ granted: string[]; denied: string[] }>(cacheKey);
    if (cached) {
      return {
        granted: new Set(cached.granted),
        denied: new Set(cached.denied),
      };
    }

    // Step 3: Aggregate role permissions
    const granted = new Set<string>();
    for (const role of roles) {
      const roleCacheKey = CACHE_KEYS.rolePermissions(tenantId, role.id);
      let rolePerms = await this.cache.get<string[]>(roleCacheKey);

      if (!rolePerms) {
        const permRoles = await this.prisma.permissionRole.findMany({
          where: { roleId: role.id, tenantId },
          include: { permission: { select: { name: true } } },
        });
        rolePerms = permRoles.map((pr) => pr.permission.name);
        await this.cache.set(roleCacheKey, rolePerms, CACHE_TTL.ROLE_PERMISSIONS);
      }

      for (const perm of rolePerms) {
        granted.add(perm);
      }
    }

    // Step 4: Apply direct user permission overrides
    const denied = new Set<string>();
    const overrides = await this.prisma.userPermission.findMany({
      where: {
        userId,
        tenantId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: { permission: { select: { name: true } } },
    });

    for (const override of overrides) {
      if (override.type === 'grant') {
        granted.add(override.permission.name);
      } else {
        denied.add(override.permission.name);
        granted.delete(override.permission.name);
      }
    }

    await this.cache.set(
      cacheKey,
      { granted: [...granted], denied: [...denied] },
      CACHE_TTL.USER_PERMISSIONS,
    );

    return { granted, denied };
  }

  private async getUserDepartment(userId: string, tenantId: string): Promise<string | null> {
    const teamUser = await this.prisma.teamUser.findFirst({
      where: { userId, tenantId },
      include: { team: { select: { departmentId: true } } },
    });
    return teamUser?.team.departmentId ?? null;
  }

  /**
   * Invalidates all cached permissions for a user.
   * Call this when roles or permissions are changed.
   */
  async invalidateUserPermissions(userId: string, tenantId: string): Promise<void> {
    await this.cache.del(CACHE_KEYS.userPermissions(tenantId, userId));
    await this.cache.delByPattern(`roles:user:${tenantId}:${userId}`);
  }

  /**
   * Invalidates all cached permissions for a role.
   * Call this when role permissions are changed.
   */
  async invalidateRolePermissions(roleId: string, tenantId: string): Promise<void> {
    await this.cache.del(CACHE_KEYS.rolePermissions(tenantId, roleId));
    await this.cache.delByPattern(`${CACHE_KEYS.userPermissions(tenantId, '*')}`);
  }
}
