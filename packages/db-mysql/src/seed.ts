import { PrismaClient } from './generated/prisma/client.js';
import { MODULES, ACTIONS, DEFAULT_ROLES } from '@repo/shared';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const PERMISSION_MODULES = MODULES;

const SUPER_ADMIN_EMAIL = process.env['SUPER_ADMIN_EMAIL'] ?? 'admin@system.com';
const SUPER_ADMIN_PASSWORD = process.env['SUPER_ADMIN_PASSWORD'] ?? 'changeme123';

async function seed() {
  console.warn('Seeding database...');

  const systemTenant = await prisma.tenant.upsert({
    where: { slug: 'system' },
    update: {},
    create: {
      name: 'System',
      slug: 'system',
      plan: 'enterprise',
      status: 'active',
      settings: { isSystemTenant: true },
    },
  });

  console.warn(`Created system tenant: ${systemTenant.id}`);

  const permissions: { name: string; description: string; module: string }[] = [];

  for (const mod of PERMISSION_MODULES) {
    for (const action of ACTIONS) {
      permissions.push({
        name: `${mod}.${action}`,
        description: `Can ${action} ${mod}`,
        module: mod,
      });
    }
  }

  permissions.push({
    name: 'system.bypass_policies',
    description: 'Bypass all policy checks (super admin)',
    module: 'system',
  });

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  console.warn(`Seeded ${permissions.length} permissions`);

  const modules = [...new Set(PERMISSION_MODULES)];
  for (const mod of modules) {
    await prisma.module.upsert({
      where: { slug: mod },
      update: {},
      create: {
        name: mod.charAt(0).toUpperCase() + mod.slice(1).replace(/-/g, ' '),
        slug: mod,
        description: `${mod} management module`,
        isActive: true,
      },
    });
  }

  console.warn(`Seeded ${modules.length} modules`);

  const allPermissions = await prisma.permission.findMany();

  const roleConfigs = [
    {
      name: 'Super Admin',
      slug: DEFAULT_ROLES.SUPER_ADMIN,
      description: 'Full system access with policy bypass',
      isSystem: true,
      permissionNames: allPermissions.map((p) => p.name),
    },
    {
      name: 'Tenant Admin',
      slug: DEFAULT_ROLES.TENANT_ADMIN,
      description: 'Full tenant-scoped access',
      isSystem: true,
      permissionNames: allPermissions
        .filter((p) => p.name !== 'system.bypass_policies')
        .map((p) => p.name),
    },
    {
      name: 'Manager',
      slug: DEFAULT_ROLES.MANAGER,
      description: 'Manage team resources',
      isSystem: true,
      permissionNames: allPermissions
        .filter(
          (p) =>
            !p.name.startsWith('tenants.') &&
            !p.name.startsWith('system.') &&
            !p.name.endsWith('.manage'),
        )
        .map((p) => p.name),
    },
    {
      name: 'Member',
      slug: DEFAULT_ROLES.MEMBER,
      description: 'Standard member access',
      isSystem: true,
      permissionNames: allPermissions
        .filter((p) => p.name.endsWith('.read') || p.name.endsWith('.create'))
        .filter(
          (p) =>
            !p.name.startsWith('tenants.') &&
            !p.name.startsWith('roles.') &&
            !p.name.startsWith('permissions.') &&
            !p.name.startsWith('system.'),
        )
        .map((p) => p.name),
    },
    {
      name: 'Viewer',
      slug: DEFAULT_ROLES.VIEWER,
      description: 'Read-only access',
      isSystem: true,
      permissionNames: allPermissions
        .filter((p) => p.name.endsWith('.read'))
        .filter((p) => !p.name.startsWith('tenants.') && !p.name.startsWith('system.'))
        .map((p) => p.name),
    },
  ];

  for (const rc of roleConfigs) {
    const role = await prisma.role.upsert({
      where: { tenantId_slug: { tenantId: systemTenant.id, slug: rc.slug } },
      update: {},
      create: {
        tenantId: systemTenant.id,
        name: rc.name,
        slug: rc.slug,
        description: rc.description,
        isSystem: rc.isSystem,
      },
    });

    const rolePerms = allPermissions.filter((p) => rc.permissionNames.includes(p.name));

    for (const perm of rolePerms) {
      await prisma.permissionRole.upsert({
        where: {
          roleId_permissionId_tenantId: {
            roleId: role.id,
            permissionId: perm.id,
            tenantId: systemTenant.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: perm.id,
          tenantId: systemTenant.id,
        },
      });
    }

    console.warn(`Seeded role: ${rc.name} with ${rolePerms.length} permissions`);
  }

  // ─── Create Super Admin User ──────────────────────────────────────────
  const superAdminRole = await prisma.role.findFirst({
    where: { tenantId: systemTenant.id, slug: DEFAULT_ROLES.SUPER_ADMIN },
  });

  if (superAdminRole) {
    const passwordHash = await argon2.hash(SUPER_ADMIN_PASSWORD, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const adminUser = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: systemTenant.id, email: SUPER_ADMIN_EMAIL } },
      update: {},
      create: {
        email: SUPER_ADMIN_EMAIL,
        passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        tenantId: systemTenant.id,
        status: 'active',
        emailVerifiedAt: new Date(),
      },
    });

    await prisma.roleUser.upsert({
      where: {
        userId_roleId_tenantId: {
          userId: adminUser.id,
          roleId: superAdminRole.id,
          tenantId: systemTenant.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
        tenantId: systemTenant.id,
      },
    });

    console.warn(`Created super admin user: ${SUPER_ADMIN_EMAIL}`);
  }

  console.warn('Database seeding completed.');
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

