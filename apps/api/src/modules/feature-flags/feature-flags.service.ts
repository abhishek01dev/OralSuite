import { createTenantPrisma } from '@repo/db-mysql';
import { PAGINATION, CACHE_KEYS } from '@repo/shared';
import type { PaginationDto, CreateFeatureFlagDto } from '@repo/shared';

/** Minimal cache interface required by this service. */
export interface FeatureFlagCacheClient {
  del(key: string): Promise<void>;
  delByPattern(pattern: string): Promise<void>;
}

export class FeatureFlagsService {
  constructor(private readonly cache: FeatureFlagCacheClient) {}

  async list(tenantId: string, params: PaginationDto) {
    const db = createTenantPrisma(tenantId);
    const { cursor, limit, sortBy, sortOrder } = params;
    const take = Math.min(limit, PAGINATION.MAX_LIMIT);

    const flags = await db.featureFlag.findMany({
      take: take + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { [sortBy ?? 'createdAt']: sortOrder },
    });

    const hasMore = flags.length > take;
    if (hasMore) flags.pop();
    const nextCursor = flags.length > 0 ? flags[flags.length - 1]!.id : null;

    return { data: flags, meta: { cursor: nextCursor, hasMore } };
  }

  async getById(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.featureFlag.findUnique({ where: { id } });
  }

  async findBySlug(tenantId: string, slug: string) {
    const db = createTenantPrisma(tenantId);
    return db.featureFlag.findFirst({ where: { slug }, select: { id: true } });
  }

  async create(tenantId: string, data: CreateFeatureFlagDto) {
    const db = createTenantPrisma(tenantId);
    const flag = await db.featureFlag.create({
      data: {
        name: data.name,
        slug: data.slug,
        isEnabled: data.isEnabled,
        conditions: data.conditions ?? undefined,
      },
    });
    await this.invalidateCache(tenantId);
    return flag;
  }

  async update(tenantId: string, id: string, data: Record<string, unknown>, previousSlug: string) {
    const db = createTenantPrisma(tenantId);
    const flag = await db.featureFlag.update({ where: { id }, data });
    await this.invalidateCache(tenantId, previousSlug);
    return flag;
  }

  async delete(tenantId: string, id: string, slug: string) {
    const db = createTenantPrisma(tenantId);
    await db.featureFlag.delete({ where: { id } });
    await this.invalidateCache(tenantId, slug);
    return { id };
  }

  async toggle(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    const existing = await db.featureFlag.findUnique({
      where: { id },
      select: { id: true, slug: true, isEnabled: true },
    });
    if (!existing) return null;

    const flag = await db.featureFlag.update({
      where: { id },
      data: { isEnabled: !existing.isEnabled },
    });
    await this.invalidateCache(tenantId, existing.slug);
    return flag;
  }

  private async invalidateCache(tenantId: string, slug?: string) {
    if (slug) {
      await this.cache.del(CACHE_KEYS.featureFlag(tenantId, slug));
    }
    await this.cache.delByPattern(`feature:${tenantId}:*`);
  }
}
