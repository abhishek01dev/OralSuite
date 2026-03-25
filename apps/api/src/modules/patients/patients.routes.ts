import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { PatientsController } from './patients.controller.js';

export async function patientsRoutes(app: FastifyInstance): Promise<void> {
  const controller = new PatientsController();

  // Basic CRUD requires corresponding permissions, or just default to basic tenant member
  app.get('/', { preHandler: [requirePermission('patients.read')] }, controller.list);
  app.get('/:id', { preHandler: [requirePermission('patients.read')] }, controller.getById);
  app.post('/', { preHandler: [requirePermission('patients.create')] }, controller.create);
  app.put('/:id', { preHandler: [requirePermission('patients.update')] }, controller.update);
  app.delete('/:id', { preHandler: [requirePermission('patients.delete')] }, controller.delete);
}
