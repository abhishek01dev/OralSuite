import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { SubscriptionsController } from './subscriptions.controller.js';

export async function subscriptionRoutes(app: FastifyInstance): Promise<void> {
  const controller = new SubscriptionsController();

  app.get('/', { preHandler: [requirePermission('subscriptions.read')] }, controller.list);
  app.get('/:id', { preHandler: [requirePermission('subscriptions.read')] }, controller.getById);
  app.post('/', { preHandler: [requirePermission('subscriptions.create')] }, controller.create);
  app.put('/:id', { preHandler: [requirePermission('subscriptions.update')] }, controller.update);
}
