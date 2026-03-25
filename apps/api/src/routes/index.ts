import type { FastifyInstance } from 'fastify';
import { authRoutes } from '@modules/auth/index.js';
import { usersRoutes } from '@modules/users/index.js';
import { rolesRoutes } from '@modules/roles/index.js';
import { permissionsRoutes } from '@modules/permissions/index.js';
import { tenantsRoutes } from '@modules/tenants/index.js';
import { departmentRoutes } from '@modules/departments/index.js';
import { teamRoutes } from '@modules/teams/index.js';
import { featureFlagRoutes } from '@modules/feature-flags/index.js';
import { auditLogRoutes } from '@modules/audit-logs/index.js';
import { subscriptionRoutes } from '@modules/subscriptions/index.js';
import { patientsRoutes } from '@modules/patients/index.js';
import { appointmentsRoutes } from '@modules/appointments/index.js';
import { chartingRoutes } from '@modules/charting/index.js';
import { billingRoutes } from '@modules/billing/index.js';
import { inventoryRoutes } from '@modules/inventory/index.js';
import { dashboardRoutes } from '@modules/dashboard/index.js';

async function v1Routes(app: FastifyInstance): Promise<void> {
  await app.register(authRoutes);
  await app.register(usersRoutes, { prefix: '/users' });
  await app.register(rolesRoutes, { prefix: '/roles' });
  await app.register(permissionsRoutes, { prefix: '/permissions' });
  await app.register(tenantsRoutes, { prefix: '/tenants' });
  await app.register(departmentRoutes, { prefix: '/departments' });
  await app.register(teamRoutes, { prefix: '/teams' });
  await app.register(featureFlagRoutes, { prefix: '/feature-flags' });
  await app.register(auditLogRoutes, { prefix: '/audit-logs' });
  await app.register(subscriptionRoutes, { prefix: '/subscriptions' });
  await app.register(patientsRoutes, { prefix: '/patients' });
  await app.register(appointmentsRoutes, { prefix: '/appointments' });
  await app.register(chartingRoutes, { prefix: '/charting' });
  await app.register(billingRoutes, { prefix: '/billing' });
  await app.register(inventoryRoutes, { prefix: '/inventory' });
  await app.register(dashboardRoutes, { prefix: '/dashboard' });
}

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(v1Routes, { prefix: '/api/v1' });
}
