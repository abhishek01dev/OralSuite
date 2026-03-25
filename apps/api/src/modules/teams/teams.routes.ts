import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { TeamsController } from './teams.controller.js';

export async function teamRoutes(app: FastifyInstance): Promise<void> {
  const controller = new TeamsController();

  app.get('/', { preHandler: [requirePermission('teams.read')] }, controller.list);
  app.get('/:id', { preHandler: [requirePermission('teams.read')] }, controller.getById);
  app.post('/', { preHandler: [requirePermission('teams.create')] }, controller.create);
  app.put('/:id', { preHandler: [requirePermission('teams.update')] }, controller.update);
  app.delete('/:id', { preHandler: [requirePermission('teams.delete')] }, controller.delete);
  app.post(
    '/:id/members',
    { preHandler: [requirePermission('teams.update')] },
    controller.addMember,
  );
  app.delete(
    '/:id/members/:userId',
    { preHandler: [requirePermission('teams.update')] },
    controller.removeMember,
  );
}
