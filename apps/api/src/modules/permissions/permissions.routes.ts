import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { PermissionsController } from './permissions.controller.js';

export async function permissionsRoutes(app: FastifyInstance): Promise<void> {
  const controller = new PermissionsController();

  app.get(
    '/',
    { preHandler: [requirePermission('permissions.read')] },
    controller.listGroupedByModule,
  );

  app.get(
    '/modules',
    { preHandler: [requirePermission('permissions.read')] },
    controller.listModules,
  );
}
