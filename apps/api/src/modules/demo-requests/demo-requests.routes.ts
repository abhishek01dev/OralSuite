import type { FastifyInstance } from 'fastify';
import { DemoRequestController } from './demo-requests.controller.js';

export async function demoRequestRoutes(app: FastifyInstance) {
  const controller = new DemoRequestController();

  // Public — no auth needed (handled by PUBLIC_PATHS in plugins)
  app.post('/', controller.create);

  // Admin-only — these require auth (not in PUBLIC_PATHS for GET/PATCH)
  app.get('/', controller.list);
  app.get('/stats', controller.stats);
  app.patch('/:id', controller.updateStatus);
}
