import { createTenantPrisma } from '@repo/db-mysql';
import { PAGINATION } from '@repo/shared';
import type { PaginationDto } from '@repo/shared';

const SUBSCRIPTION_INCLUDE = {
  tenant: { select: { id: true, name: true, slug: true } },
} as const;

interface SubscriptionListFilters {
  status?: string;
}

export class SubscriptionsService {
  async list(tenantId: string, params: PaginationDto, filters: SubscriptionListFilters) {
    const db = createTenantPrisma(tenantId);
    const { cursor, limit, sortBy, sortOrder } = params;
    const take = Math.min(limit, PAGINATION.MAX_LIMIT);

    const where = filters.status
      ? { status: filters.status as 'active' | 'cancelled' | 'expired' | 'trial' }
      : {};

    const subscriptions = await db.subscription.findMany({
      where,
      take: take + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { [sortBy ?? 'createdAt']: sortOrder },
      include: SUBSCRIPTION_INCLUDE,
    });

    const hasMore = subscriptions.length > take;
    if (hasMore) subscriptions.pop();
    const nextCursor =
      subscriptions.length > 0 ? subscriptions[subscriptions.length - 1]!.id : null;

    return { data: subscriptions, meta: { cursor: nextCursor, hasMore } };
  }

  async getById(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.subscription.findUnique({
      where: { id },
      include: {
        tenant: { select: { id: true, name: true, slug: true, plan: true } },
      },
    });
  }

  async hasActiveSubscription(tenantId: string) {
    const db = createTenantPrisma(tenantId);
    return db.subscription.findFirst({
      where: { status: 'active' },
      select: { id: true },
    });
  }

  async create(
    tenantId: string,
    data: {
      plan: 'free' | 'starter' | 'professional' | 'enterprise';
      status: 'active' | 'cancelled' | 'expired' | 'trial';
      startedAt?: string;
      expiresAt?: string | null;
      metadata?: Record<string, unknown>;
    },
  ) {
    const db = createTenantPrisma(tenantId);
    return db.subscription.create({
      data: {
        plan: data.plan,
        status: data.status,
        startedAt: data.startedAt ? new Date(data.startedAt) : new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        metadata: data.metadata ?? undefined,
        tenantId,
      },
      include: SUBSCRIPTION_INCLUDE,
    });
  }

  async update(tenantId: string, id: string, data: Record<string, unknown>) {
    const db = createTenantPrisma(tenantId);
    return db.subscription.update({
      where: { id },
      data,
      include: SUBSCRIPTION_INCLUDE,
    });
  }

  async exists(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.subscription.findUnique({ where: { id }, select: { id: true } });
  }
}
