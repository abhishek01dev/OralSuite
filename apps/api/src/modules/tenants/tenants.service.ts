import { prisma } from '@repo/db-mysql';
import type { CreateTenantDto, UpdateTenantDto, PaginationParams } from '@repo/shared';

const VALID_SORT_FIELDS: ReadonlySet<string> = new Set([
  'name',
  'slug',
  'plan',
  'status',
  'createdAt',
  'updatedAt',
]);

/**
 * Handles all tenant-related database operations using the global
 * (unscoped) Prisma client since tenants are cross-tenant entities.
 */
export class TenantsService {
  async list(params: PaginationParams) {
    const { cursor, limit, sortBy, sortOrder = 'desc' } = params;
    const orderField = sortBy && VALID_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';

    const [total, items] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.findMany({
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { [orderField]: sortOrder },
        include: {
          _count: {
            select: { users: true, roles: true, subscriptions: true },
          },
        },
      }),
    ]);

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1]!.id : null;

    return { data, meta: { cursor: nextCursor, hasMore, total } };
  }

  async getById(id: string) {
    return prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true, roles: true, subscriptions: true },
        },
      },
    });
  }

  async create(data: CreateTenantDto) {
    return prisma.tenant.create({ data: data as never });
  }

  async update(id: string, data: UpdateTenantDto) {
    return prisma.tenant.update({ where: { id }, data: data as never });
  }

  async delete(id: string) {
    return prisma.tenant.delete({ where: { id } });
  }
}
