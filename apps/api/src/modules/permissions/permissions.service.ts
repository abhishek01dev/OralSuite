import { prisma } from '@repo/db-mysql';

/**
 * Encapsulates read-only operations for the global permissions table.
 * Permissions are not tenant-scoped.
 */
export class PermissionsService {
  async listGroupedByModule() {
    const permissions = await prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { name: 'asc' }],
    });

    return permissions.reduce<Record<string, (typeof permissions)[number][]>>((acc, permission) => {
      const key = permission.module;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key]!.push(permission);
      return acc;
    }, {});
  }

  async listModules() {
    return prisma.module.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
