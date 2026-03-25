import type { FastifyRequest, FastifyReply } from 'fastify';
import { paginationSchema, HTTP_STATUS } from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { SubscriptionsService } from './subscriptions.service.js';
import { z } from 'zod';

const createSubscriptionDto = z.object({
  plan: z.enum(['free', 'starter', 'professional', 'enterprise']),
  status: z.enum(['active', 'cancelled', 'expired', 'trial']).default('active'),
  startedAt: z.string().datetime({ offset: true }).optional(),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const updateSubscriptionDto = createSubscriptionDto.partial();

interface IdParam {
  id: string;
}

export class SubscriptionsController {
  private readonly service = new SubscriptionsService();

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const params = paginationSchema.parse(req.query);
    const query = req.query as Record<string, string>;
    const statusFilter = query['status'];

    const result = await this.service.list(req.tenantId, params, { status: statusFilter });
    return sendSuccess(reply, result);
  };

  getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;

    const subscription = await this.service.getById(req.tenantId, id);

    if (!subscription) {
      return sendError(
        reply,
        HTTP_STATUS.NOT_FOUND,
        'SUBSCRIPTION_NOT_FOUND',
        'Subscription not found',
      );
    }

    return sendSuccess(reply, subscription);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createSubscriptionDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid subscription data',
        parsed.error.flatten(),
      );
    }

    const { plan, status, startedAt, expiresAt, metadata } = parsed.data;

    const activeSubscription = await this.service.hasActiveSubscription(req.tenantId);
    if (activeSubscription) {
      return sendError(
        reply,
        HTTP_STATUS.CONFLICT,
        'ACTIVE_SUBSCRIPTION_EXISTS',
        'Tenant already has an active subscription. Update it instead.',
      );
    }

    const subscription = await this.service.create(req.tenantId, {
      plan,
      status,
      startedAt,
      expiresAt,
      metadata,
    });

    return sendSuccess(reply, subscription, HTTP_STATUS.CREATED);
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const parsed = updateSubscriptionDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid subscription data',
        parsed.error.flatten(),
      );
    }

    const existing = await this.service.exists(req.tenantId, id);
    if (!existing) {
      return sendError(
        reply,
        HTTP_STATUS.NOT_FOUND,
        'SUBSCRIPTION_NOT_FOUND',
        'Subscription not found',
      );
    }

    const { startedAt, expiresAt, metadata, ...rest } = parsed.data;

    const updateData: Record<string, unknown> = {
      ...rest,
      ...(startedAt !== undefined && { startedAt: new Date(startedAt) }),
      ...(expiresAt !== undefined && {
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }),
      ...(metadata !== undefined && { metadata }),
    };

    const subscription = await this.service.update(req.tenantId, id, updateData);
    return sendSuccess(reply, subscription);
  };
}
