import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { TenantsController } from './tenants.controller.js';

export async function tenantsRoutes(app: FastifyInstance): Promise<void> {
  const controller = new TenantsController();

  app.get('/', { preHandler: [requirePermission('tenants.read')] }, controller.list);

  app.get('/:id', { preHandler: [requirePermission('tenants.read')] }, controller.getById);

  app.post('/', { preHandler: [requirePermission('tenants.create')] }, controller.create);

  app.put('/:id', { preHandler: [requirePermission('tenants.update')] }, controller.update);

  app.delete('/:id', { preHandler: [requirePermission('tenants.delete')] }, controller.delete);
}
