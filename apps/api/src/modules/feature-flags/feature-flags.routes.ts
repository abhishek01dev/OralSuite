import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { FeatureFlagsController } from './feature-flags.controller.js';
import type { FeatureFlagCacheClient } from './feature-flags.service.js';

export async function featureFlagRoutes(app: FastifyInstance): Promise<void> {
  const cache = (app as unknown as { cache: FeatureFlagCacheClient }).cache;
  const controller = new FeatureFlagsController(cache);

  app.get('/', { preHandler: [requirePermission('feature-flags.read')] }, controller.list);
  app.get('/:id', { preHandler: [requirePermission('feature-flags.read')] }, controller.getById);
  app.post('/', { preHandler: [requirePermission('feature-flags.create')] }, controller.create);
  app.put('/:id', { preHandler: [requirePermission('feature-flags.update')] }, controller.update);
  app.delete(
    '/:id',
    { preHandler: [requirePermission('feature-flags.delete')] },
    controller.delete,
  );
  app.patch(
    '/:id/toggle',
    { preHandler: [requirePermission('feature-flags.update')] },
    controller.toggle,
  );
}
