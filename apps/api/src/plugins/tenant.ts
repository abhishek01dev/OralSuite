import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { prisma } from '@repo/db-mysql';
import { CACHE_KEYS, CACHE_TTL, HTTP_STATUS } from '@repo/shared';
import { sendError } from '@utils/response.js';

declare module 'fastify' {
  interface FastifyRequest {
    tenantId: string;
    tenantContext: {
      id: string;
      slug: string;
      plan: string;
      status: string;
      settings: Record<string, unknown> | null;
    };
  }
}

/** Cache interface required by this plugin — satisfied by the app.cache decoration. */
interface TenantCacheClient {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttl?: number): Promise<void>;
}

const PUBLIC_PATHS = [
  '/health',
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh',
  '/api/v1/demo-requests',
];

async function tenantPluginFn(app: FastifyInstance) {
  const cache = (app as unknown as { cache: TenantCacheClient }).cache;

  app.addHook('onRequest', async (req: FastifyRequest, reply: FastifyReply) => {
    const tenantId = resolveTenantId(req);

    // For public paths, resolve tenant if provided but don't require it
    if (PUBLIC_PATHS.some((p) => req.url.startsWith(p))) {
      if (tenantId) {
        // Resolve by UUID first, then try slug
        const resolved = await resolveTenantFromDb(tenantId);
        if (resolved) {
          req.tenantId = resolved;
        } else {
          req.tenantId = tenantId;
        }
      }
      return;
    }

    if (!tenantId) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'TENANT_REQUIRED',
        'Tenant identification required',
      );
    }

    const cacheKey = CACHE_KEYS.tenant(tenantId);
    let tenant = await cache.get<typeof req.tenantContext>(cacheKey);

    if (!tenant) {
      const dbTenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, slug: true, plan: true, status: true, settings: true },
      });

      if (!dbTenant) {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'TENANT_NOT_FOUND', 'Tenant not found');
      }

      tenant = {
        id: dbTenant.id,
        slug: dbTenant.slug,
        plan: dbTenant.plan,
        status: dbTenant.status,
        settings: dbTenant.settings as Record<string, unknown> | null,
      };
      await cache.set(cacheKey, tenant, CACHE_TTL.TENANT_CONFIG);
    }

    if (tenant.status !== 'active') {
      return sendError(reply, HTTP_STATUS.FORBIDDEN, 'TENANT_INACTIVE', 'Tenant is not active');
    }

    req.tenantId = tenant.id;
    req.tenantContext = tenant;
  });
}

/**
 * Resolves a tenant identifier (which could be a UUID or slug) to the actual tenant UUID.
 * Returns the UUID if found, null otherwise.
 */
async function resolveTenantFromDb(identifier: string): Promise<string | null> {
  // Try by UUID first
  const byId = await prisma.tenant.findUnique({
    where: { id: identifier },
    select: { id: true },
  });
  if (byId) return byId.id;

  // Try by slug
  const bySlug = await prisma.tenant.findUnique({
    where: { slug: identifier },
    select: { id: true },
  });
  if (bySlug) return bySlug.id;

  return null;
}

function resolveTenantId(req: FastifyRequest): string | undefined {
  const headerTenant = req.headers['x-tenant-id'] as string | undefined;
  if (headerTenant) return headerTenant;

  const host = req.hostname;
  if (host && host.includes('.')) {
    const subdomain = host.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      return subdomain;
    }
  }

  return undefined;
}

export const tenantPlugin = fp(tenantPluginFn, {
  name: 'tenant-plugin',
});
