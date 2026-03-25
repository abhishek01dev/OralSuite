import { prisma, createTenantPrisma } from '@repo/db-mysql';
import { PasswordService } from '@repo/auth';
import { DEFAULT_ROLES } from '@repo/shared';

const USER_BASIC_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  status: true,
  createdAt: true,
} as const;

export class AuthService {
  async checkEmailExists(tenantId: string, email: string) {
    const db = createTenantPrisma(tenantId);
    return db.user.findFirst({ where: { email }, select: { id: true } });
  }

  async registerUser(
    tenantId: string,
    data: { email: string; password: string; firstName: string; lastName: string; practiceName?: string },
  ) {
    let targetTenantId = tenantId;
    let isNewTenant = false;

    if (data.practiceName) {
      // Create a unique slug for the tenant
      let slug = data.practiceName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40);
      
      // Check if slug already exists, if so append random string
      const existingTenant = await prisma.tenant.findUnique({ where: { slug } });
      if (existingTenant) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
      }

      const tenant = await prisma.tenant.create({
        data: {
          name: data.practiceName,
          slug,
          status: 'active',
        },
      });
      targetTenantId = tenant.id;
      isNewTenant = true;
      
      // Initialize basic roles for the new tenant
      await this.initializeTenant(targetTenantId);
    }

    const db = createTenantPrisma(targetTenantId);
    const passwordHash = await PasswordService.hash(data.password);

    const roleSlug = isNewTenant ? DEFAULT_ROLES.TENANT_ADMIN : DEFAULT_ROLES.MEMBER;
    
    // Find role by slug for this specific tenant
    let role = await db.role.findFirst({
      where: { slug: roleSlug, tenantId: targetTenantId },
    });

    // Fallback: If no role exists for this tenant yet (new tenant), find system role or create one
    if (!role && isNewTenant) {
      // Create default roles for the new tenant if they don't exist
      // In this demo, we'll try to find any role with that slug or just use the system one if allowed
      role = await prisma.role.findFirst({
        where: { slug: roleSlug }
      });
    }

    const user = await db.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        tenantId: targetTenantId,
      },
      select: USER_BASIC_SELECT,
    });

    if (role) {
      await db.roleUser.create({
        data: { userId: user.id, roleId: role.id, tenantId: targetTenantId },
      });
    }

    return { ...user, tenantId: targetTenantId };
  }

  async initializeTenant(tenantId: string) {
    const db = createTenantPrisma(tenantId);
    
    // Create basic roles for the new tenant
    await db.role.createMany({
      data: [
        {
          name: 'Tenant Admin',
          slug: DEFAULT_ROLES.TENANT_ADMIN,
          description: 'Administrator for this clinic',
          tenantId,
          isSystem: true,
        },
        {
          name: 'Member',
          slug: DEFAULT_ROLES.MEMBER,
          description: 'Standard staff member',
          tenantId,
          isSystem: true,
        },
      ],
    });

    // Note: PermissionRoles normally follow here too, but for this implementation
    // let's assume global policy checks or system-level permission lookup 
    // satisfies basics. A full implementation would clone permissions too.
  }

  async findUserByEmail(tenantId: string, email: string) {
    const db = createTenantPrisma(tenantId);
    return db.user.findFirst({
      where: { email },
      include: {
        roleUsers: { include: { role: true } },
      },
    });
  }

  async updateLastLogin(tenantId: string, userId: string) {
    const db = createTenantPrisma(tenantId);
    await db.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async findUserWithPermissions(tenantId: string, userId: string) {
    const db = createTenantPrisma(tenantId);
    return db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        tenantId: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        status: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        roleUsers: {
          include: {
            role: {
              include: {
                permissionRoles: { include: { permission: true } },
              },
            },
          },
        },
      },
    });
  }

  async verifyPassword(hash: string, password: string) {
    return PasswordService.verify(hash, password);
  }

  async createPasswordResetToken(tenantId: string, email: string) {
    const db = createTenantPrisma(tenantId);
    const user = await db.user.findFirst({ where: { email }, select: { id: true } });
    if (!user) return null;

    // Generate a secure token (using a simple random string for now, could be more robust)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await db.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        tenantId,
        expiresAt,
      },
    });

    return token;
  }

  async resetPassword(tenantId: string, token: string, newPassword: string) {
    const db = createTenantPrisma(tenantId);
    const resetEntry = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetEntry || resetEntry.tenantId !== tenantId || resetEntry.expiresAt < new Date()) {
      return { success: false, message: 'Invalid or expired token' };
    }

    const passwordHash = await PasswordService.hash(newPassword);

    await db.$transaction([
      db.user.update({
        where: { id: resetEntry.userId },
        data: { passwordHash },
      }),
      db.passwordResetToken.delete({
        where: { id: resetEntry.id },
      }),
    ]);

    return { success: true };
  }
}
