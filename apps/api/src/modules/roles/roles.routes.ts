import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { RolesController } from './roles.controller.js';

export async function rolesRoutes(app: FastifyInstance): Promise<void> {
  const controller = new RolesController();

  app.get('/', { preHandler: [requirePermission('roles.read')] }, controller.list);

  app.get('/:id', { preHandler: [requirePermission('roles.read')] }, controller.getById);

  app.post('/', { preHandler: [requirePermission('roles.create')] }, controller.create);

  app.put('/:id', { preHandler: [requirePermission('roles.update')] }, controller.update);

  app.delete('/:id', { preHandler: [requirePermission('roles.delete')] }, controller.delete);

  app.post(
    '/:id/permissions',
    { preHandler: [requirePermission('permissions.manage')] },
    controller.assignPermissions,
  );

  app.delete(
    '/:id/permissions/:permissionId',
    { preHandler: [requirePermission('permissions.manage')] },
    controller.removePermission,
  );
}
