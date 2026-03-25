import type { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller.js';

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();

  app.post('/auth/register', controller.register);
  app.post('/auth/login', controller.login);
  app.post('/auth/refresh', controller.refresh);
  app.post('/auth/logout', controller.logout);
  app.post('/auth/forgot-password', controller.forgotPassword);
  app.post('/auth/reset-password', controller.resetPassword);
  app.get('/auth/me', controller.me);
}
