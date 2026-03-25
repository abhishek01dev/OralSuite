import type { FastifyInstance } from 'fastify';
import { UsersController } from './users.controller.js';
import { requirePermission } from '@plugins/authorize.js';

export async function usersRoutes(app: FastifyInstance) {
  const controller = new UsersController();

  app.get('/', controller.list);
  app.get('/:id', { preHandler: [requirePermission('users.read')] }, controller.getById);
  app.post('/', { preHandler: [requirePermission('users.create')] }, controller.create);
  app.put('/:id', { preHandler: [requirePermission('users.update')] }, controller.update);
  app.delete('/:id', { preHandler: [requirePermission('users.delete')] }, controller.delete);
  app.post(
    '/:id/roles',
    { preHandler: [requirePermission('roles.manage')] },
    controller.assignRoles,
  );
  app.delete(
    '/:id/roles/:roleId',
    { preHandler: [requirePermission('roles.manage')] },
    controller.removeRole,
  );
  app.post(
    '/:id/permissions',
    { preHandler: [requirePermission('roles.manage')] },
    controller.overridePermission,
  );
}
