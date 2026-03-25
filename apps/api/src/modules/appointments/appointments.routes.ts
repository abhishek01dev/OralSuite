import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { AppointmentsController } from './appointments.controller.js';

export async function appointmentsRoutes(app: FastifyInstance): Promise<void> {
  const controller = new AppointmentsController();

  app.get('/', { preHandler: [requirePermission('appointments.read')] }, controller.list);
  app.get('/:id', { preHandler: [requirePermission('appointments.read')] }, controller.getById);
  app.post('/', { preHandler: [requirePermission('appointments.create')] }, controller.create);
  app.put('/:id', { preHandler: [requirePermission('appointments.update')] }, controller.update);
  app.delete('/:id', { preHandler: [requirePermission('appointments.delete')] }, controller.delete);
}
