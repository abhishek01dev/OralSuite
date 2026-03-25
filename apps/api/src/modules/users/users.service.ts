import { createTenantPrisma, prisma } from '@repo/db-mysql';
import { PasswordService } from '@repo/auth';
import { CACHE_KEYS } from '@repo/shared';
import type {
  CreateUserDto,
  UpdateUserDto,
  PaginationParams,
  UserPermissionOverrideDto,
  PaginatedResponse,
} from '@repo/shared';
import type { CacheService } from '@repo/cache';

interface UserListFilters {
  status?: string;
  search?: string;
}

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  status: true,
  emailVerifiedAt: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

const USER_WITH_ROLES = {
  ...USER_SELECT,
  roleUsers: {
    include: {
      role: {
        select: { id: true, name: true, slug: true },
      },
    },
  },
} as const;

const VALID_SORT_FIELDS: ReadonlySet<string> = new Set([
  'firstName',
  'lastName',
  'email',
  'createdAt',
  'updatedAt',
  'lastLoginAt',
]);

/**
 * Encapsulates all user-related database operations,
 * always scoped to a tenant via `createTenantPrisma`.
 */
export class UsersService {
  async list(
    tenantId: string,
    params: PaginationParams,
    filters: UserListFilters,
  ): Promise<PaginatedResponse<Record<string, unknown>>> {
    const db = createTenantPrisma(tenantId);
    const { cursor, limit, sortBy, sortOrder = 'desc' } = params;
    const orderField = sortBy && VALID_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';

    const where: Record<string, unknown> = {};

    if (filters.status) {
      where['status'] = filters.status;
    }

    if (filters.search) {
      where['OR'] = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    const [total, items] = await Promise.all([
      db.user.count({ where }),
      db.user.findMany({
        where,
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { [orderField]: sortOrder },
        select: USER_WITH_ROLES,
      }),
    ]);

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1]!.id : null;

    return {
      data: data as unknown as Record<string, unknown>[],
      meta: { cursor: nextCursor, hasMore, total },
    };
  }

  async getById(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.user.findUnique({
      where: { id },
      select: {
        ...USER_WITH_ROLES,
        userPermissions: {
          include: { permission: { select: { id: true, name: true, module: true } } },
        },
      },
    });
  }

  async create(tenantId: string, data: CreateUserDto) {
    const db = createTenantPrisma(tenantId);
    const { password, roleIds, ...userData } = data;

    const passwordHash = await PasswordService.hash(password);

    const user = await db.user.create({
      data: { ...userData, passwordHash, tenantId },
      select: USER_SELECT,
    });

    if (roleIds?.length) {
      await db.roleUser.createMany({
        data: roleIds.map((roleId) => ({ userId: user.id, roleId, tenantId })),
        skipDuplicates: true,
      });
    }

    return this.getById(tenantId, user.id);
  }

  async update(tenantId: string, id: string, data: UpdateUserDto) {
    const db = createTenantPrisma(tenantId);
    await db.user.update({ where: { id }, data });
    return this.getById(tenantId, id);
  }

  async softDelete(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    await db.user.update({
      where: { id },
      data: { status: 'inactive' },
    });
    return { id };
  }

  async findByEmail(tenantId: string, email: string) {
    const db = createTenantPrisma(tenantId);
    return db.user.findFirst({
      where: { email },
      select: { id: true },
    });
  }

  async assignRoles(
    tenantId: string,
    userId: string,
    roleIds: string[],
    assignedBy: string,
    cache?: CacheService,
  ) {
    const db = createTenantPrisma(tenantId);

    await db.roleUser.createMany({
      data: roleIds.map((roleId) => ({ userId, roleId, assignedBy, tenantId })),
      skipDuplicates: true,
    });

    if (cache) {
      await cache.del(CACHE_KEYS.userPermissions(tenantId, userId));
    }

    return this.getById(tenantId, userId);
  }

  async removeRole(tenantId: string, userId: string, roleId: string, cache?: CacheService) {
    const db = createTenantPrisma(tenantId);

    await db.roleUser.deleteMany({
      where: { userId, roleId },
    });

    if (cache) {
      await cache.del(CACHE_KEYS.userPermissions(tenantId, userId));
    }

    return this.getById(tenantId, userId);
  }

  async overridePermission(
    tenantId: string,
    userId: string,
    data: UserPermissionOverrideDto,
    cache?: CacheService,
  ) {
    const db = createTenantPrisma(tenantId);

    const permissionExists = await prisma.permission.findUnique({
      where: { id: data.permissionId },
      select: { id: true },
    });

    if (!permissionExists) {
      return null;
    }

    const override = await db.userPermission.upsert({
      where: {
        userId_permissionId_tenantId: { userId, permissionId: data.permissionId, tenantId },
      },
      create: {
        userId,
        permissionId: data.permissionId,
        tenantId,
        type: data.type,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      update: {
        type: data.type,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: {
        permission: { select: { id: true, name: true, module: true } },
      },
    });

    if (cache) {
      await cache.del(CACHE_KEYS.userPermissions(tenantId, userId));
    }

    return override;
  }
}
