import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { AuditLogsController } from './audit-logs.controller.js';

export async function auditLogRoutes(app: FastifyInstance): Promise<void> {
  const controller = new AuditLogsController();

  app.get('/', { preHandler: [requirePermission('audit-logs.read')] }, controller.list);
}
