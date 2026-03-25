import { PrismaClient } from './generated/prisma/client.js';
import { appConfig } from '@repo/config';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: appConfig.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (appConfig.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Creates a tenant-scoped Prisma client that automatically injects tenant_id
 * into every query, preventing cross-tenant data access.
 */
export const createTenantPrisma = (tenantId: string) => {
  return prisma.$extends({
    query: {
      $allOperations({ model, operation, args, query }) {
        const tenantScopedModels = [
          'User',
          'Role',
          'RoleUser',
          'PermissionRole',
          'UserPermission',
          'Department',
          'Team',
          'TeamUser',
          'FeatureFlag',
          'Subscription',
        ];

        if (!model || !tenantScopedModels.includes(model)) {
          return query(args);
        }

        const writeOps = ['create', 'createMany', 'upsert'];
        const readOps = ['findUnique', 'findFirst', 'findMany', 'count', 'aggregate', 'groupBy'];
        const updateOps = ['update', 'updateMany'];
        const deleteOps = ['delete', 'deleteMany'];

        if (writeOps.includes(operation)) {
          if (operation === 'createMany') {
            const data = (args as Record<string, unknown>)['data'];
            if (Array.isArray(data)) {
              (args as Record<string, unknown>)['data'] = data.map(
                (item: Record<string, unknown>) => ({
                  ...item,
                  tenantId,
                }),
              );
            }
          } else if (operation === 'upsert') {
            const a = args as Record<string, Record<string, unknown>>;
            a['where'] = { ...a['where'], tenantId };
            a['create'] = { ...a['create'], tenantId };
          } else {
            const a = args as Record<string, Record<string, unknown>>;
            a['data'] = { ...a['data'], tenantId };
          }
        }

        if ([...readOps, ...updateOps, ...deleteOps].includes(operation)) {
          const a = args as Record<string, Record<string, unknown>>;
          a['where'] = { ...a['where'], tenantId };
        }

        return query(args);
      },
    },
  });
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
