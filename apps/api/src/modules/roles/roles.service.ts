import { createTenantPrisma, prisma } from '@repo/db-mysql';
import type { CreateRoleDto, UpdateRoleDto, PaginationParams } from '@repo/shared';

const VALID_SORT_FIELDS: ReadonlySet<string> = new Set(['name', 'slug', 'createdAt', 'updatedAt']);

/**
 * Handles all role-related database operations scoped to a tenant
 * via the tenant-aware Prisma client.
 */
export class RolesService {
  async list(tenantId: string, params: PaginationParams) {
    const db = createTenantPrisma(tenantId);
    const { cursor, limit, sortBy, sortOrder = 'desc' } = params;
    const orderField = sortBy && VALID_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';

    const [total, items] = await Promise.all([
      db.role.count(),
      db.role.findMany({
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { [orderField]: sortOrder },
        include: {
          _count: { select: { roleUsers: true, permissionRoles: true } },
        },
      }),
    ]);

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1]!.id : null;

    return { data, meta: { cursor: nextCursor, hasMore, total } };
  }

  async getById(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.role.findUnique({
      where: { id },
      include: {
        permissionRoles: { include: { permission: true } },
        _count: { select: { roleUsers: true } },
      },
    });
  }

  async create(tenantId: string, data: CreateRoleDto) {
    const db = createTenantPrisma(tenantId);
    const { permissionIds, ...roleData } = data;

    const role = await db.role.create({ data: { ...roleData, tenantId } });

    if (permissionIds?.length) {
      await db.permissionRole.createMany({
        data: permissionIds.map((pid) => ({
          roleId: role.id,
          permissionId: pid,
          tenantId,
        })),
        skipDuplicates: true,
      });
    }

    return this.getById(tenantId, role.id);
  }

  async update(tenantId: string, id: string, data: UpdateRoleDto) {
    const db = createTenantPrisma(tenantId);
    const { permissionIds: _, ...roleData } = data;
    await db.role.update({ where: { id }, data: roleData });
    return this.getById(tenantId, id);
  }

  async delete(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.role.delete({ where: { id } });
  }

  async assignPermissions(tenantId: string, roleId: string, permissionIds: string[]) {
    const db = createTenantPrisma(tenantId);
    await db.permissionRole.createMany({
      data: permissionIds.map((pid) => ({
        roleId,
        permissionId: pid,
        tenantId,
      })),
      skipDuplicates: true,
    });
    return this.getById(tenantId, roleId);
  }

  async removePermission(tenantId: string, roleId: string, permissionId: string) {
    const db = createTenantPrisma(tenantId);
    await db.permissionRole.deleteMany({
      where: { roleId, permissionId },
    });
    return this.getById(tenantId, roleId);
  }

  /** Validates that all provided permission IDs exist in the global permissions table. */
  async validatePermissionIds(permissionIds: string[]): Promise<string[]> {
    const found = await prisma.permission.findMany({
      where: { id: { in: permissionIds } },
      select: { id: true },
    });
    return found.map((p) => p.id);
  }
}
