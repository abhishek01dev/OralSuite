import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import { appConfig, authConfig } from '@repo/config';
import { logger } from '@repo/logger';
import { prisma, disconnectPrisma } from '@repo/db-mysql';
import { connectMongo, disconnectMongo } from '@repo/db-mongo';
import { createCacheService } from '@repo/cache';
import { AuthorizationPipeline, PolicyEngine } from '@repo/rbac';
import { TokenService } from '@repo/auth';
import { tenantPlugin, authPlugin, auditPlugin, errorHandler } from './plugins/index.js';
import { registerRoutes } from './routes/index.js';

/**
 * Builds and returns a fully configured Fastify application instance.
 * Connects all external services (Redis, MongoDB) and registers all
 * plugins, decorations, and routes. Teardown is handled via an `onClose`
 * hook so that `await app.close()` always cleans up correctly, whether
 * called from a process signal handler or a test suite.
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app: FastifyInstance = Fastify({
    logger: {
      level: appConfig.nodeEnv === 'production' ? 'info' : 'debug',
      transport:
        appConfig.nodeEnv !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
    requestIdLogLabel: 'req-',
    genReqId: () => crypto.randomUUID(),
    trustProxy: true,
  });

  // External service connections
  const cache = createCacheService();
  await cache.connect();
  if (cache.isConnected()) {
    logger.info('Redis connected');
  } else {
    logger.warn('Redis unavailable — running without cache (in-memory rate limiting)');
  }

  await connectMongo();

  // Shared service instances
  const policyEngine = new PolicyEngine();
  const authPipeline = new AuthorizationPipeline({ prisma, cache, policyEngine });
  const tokenService = new TokenService(cache);

  // Decorate Fastify instance with shared services
  app.decorate('prisma', prisma);
  app.decorate('cache', cache);
  app.decorate('authPipeline', authPipeline);
  app.decorate('policyEngine', policyEngine);
  app.decorate('tokenService', tokenService);

  // Security plugins
  await app.register(helmet, { global: true });
  await app.register(cors, {
    origin: appConfig.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Rate limiting — Redis-backed when available, in-memory fallback otherwise
  const rateLimitOpts: Record<string, unknown> = {
    max: appConfig.rateLimitGlobal,
    timeWindow: '1 minute',
    keyGenerator: (req: { ip: string } & Record<string, unknown>) => {
      const tenantId = (req as unknown as Record<string, unknown>)['tenantId'] as
        | string
        | undefined;
      return `${tenantId ?? 'global'}:${req.ip}`;
    },
  };
  if (cache.isConnected()) {
    rateLimitOpts['redis'] = cache.getClient();
  }
  await app.register(rateLimit, rateLimitOpts);

  // Body parsing, JWT, and cookie support
  await app.register(fastifyFormbody);
  await app.register(fastifyCookie);
  await app.register(fastifyJwt, { secret: authConfig.jwtSecret });

  // Custom plugins (order matters: tenant → auth → audit)
  await app.register(tenantPlugin);
  await app.register(authPlugin);
  await app.register(auditPlugin);

  // Global error handler
  app.setErrorHandler(errorHandler);

  // Health check — outside the versioned API prefix so it is always reachable
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // All versioned API routes
  await registerRoutes(app);

  // Teardown hook — called by app.close() so any shutdown path (signal, test)
  // disconnects all services cleanly and in the correct order.
  app.addHook('onClose', async () => {
    await disconnectPrisma();
    await disconnectMongo();
    await cache.disconnect();
  });

  return app;
}
