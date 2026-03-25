import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { getDashboardStats } from './dashboard.controller.js';

export async function dashboardRoutes(app: FastifyInstance): Promise<void> {
  // Requires basic access to view dashboard
  app.get('/stats', { preHandler: [requirePermission('dashboard.read')] }, getDashboardStats);
}
