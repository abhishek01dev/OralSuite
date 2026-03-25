import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { ChartingController } from './charting.controller.js';

export async function chartingRoutes(app: FastifyInstance): Promise<void> {
  const controller = new ChartingController();

  app.get('/', { preHandler: [requirePermission('charting.read')] }, controller.list);
  app.get('/:id', { preHandler: [requirePermission('charting.read')] }, controller.getById);
  app.post('/', { preHandler: [requirePermission('charting.create')] }, controller.create);
  app.put('/:id', { preHandler: [requirePermission('charting.update')] }, controller.update);
  app.delete('/:id', { preHandler: [requirePermission('charting.delete')] }, controller.delete);
}
