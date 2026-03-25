import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { DepartmentsController } from './departments.controller.js';

export async function departmentRoutes(app: FastifyInstance): Promise<void> {
  const controller = new DepartmentsController();

  app.get('/', { preHandler: [requirePermission('departments.read')] }, controller.list);
  app.get('/tree', { preHandler: [requirePermission('departments.read')] }, controller.getTree);
  app.get('/:id', { preHandler: [requirePermission('departments.read')] }, controller.getById);
  app.post('/', { preHandler: [requirePermission('departments.create')] }, controller.create);
  app.put('/:id', { preHandler: [requirePermission('departments.update')] }, controller.update);
  app.delete('/:id', { preHandler: [requirePermission('departments.delete')] }, controller.delete);
}
