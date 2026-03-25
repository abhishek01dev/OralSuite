import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { HTTP_STATUS } from '@repo/shared';
import type { JwtPayload } from '@repo/auth';
import { sendError } from '@utils/response.js';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
    userEmail: string;
    jwtPayload: JwtPayload;
  }
}

const PUBLIC_PATHS = [
  '/health',
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh',
];

async function authPluginFn(app: FastifyInstance) {
  app.addHook('onRequest', async (req: FastifyRequest, reply: FastifyReply) => {
    if (PUBLIC_PATHS.some((p) => req.url.startsWith(p))) {
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(
        reply,
        HTTP_STATUS.UNAUTHORIZED,
        'UNAUTHORIZED',
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.slice(7);

    try {
      const tokenService = (app as unknown as Record<string, unknown>)['tokenService'] as {
        verifyToken: (t: string) => JwtPayload;
        isTokenBlacklisted: (jti: string) => Promise<boolean>;
      };

      const payload = tokenService.verifyToken(token);

      if (payload.type !== 'access') {
        return sendError(
          reply,
          HTTP_STATUS.UNAUTHORIZED,
          'INVALID_TOKEN_TYPE',
          'Expected access token',
        );
      }

      const isBlacklisted = await tokenService.isTokenBlacklisted(payload.jti);
      if (isBlacklisted) {
        return sendError(
          reply,
          HTTP_STATUS.UNAUTHORIZED,
          'TOKEN_REVOKED',
          'Token has been revoked',
        );
      }

      if (req.tenantId && payload.tenantId !== req.tenantId) {
        return sendError(
          reply,
          HTTP_STATUS.FORBIDDEN,
          'TENANT_MISMATCH',
          'Token tenant does not match request tenant',
        );
      }

      req.userId = payload.sub;
      req.userEmail = payload.email;
      req.tenantId = req.tenantId || payload.tenantId;
      req.jwtPayload = payload;
    } catch {
      return sendError(
        reply,
        HTTP_STATUS.UNAUTHORIZED,
        'INVALID_TOKEN',
        'Invalid or expired token',
      );
    }
  });
}

export const authPlugin = fp(authPluginFn, {
  name: 'auth-plugin',
  dependencies: ['tenant-plugin'],
});
