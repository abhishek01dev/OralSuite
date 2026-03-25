export const SYSTEM_PERMISSIONS = {
  BYPASS_POLICIES: 'system.bypass_policies',
  MANAGE_TENANTS: 'tenants.manage',
} as const;

export const MODULES = [
  'users',
  'roles',
  'permissions',
  'tenants',
  'departments',
  'teams',
  'feature-flags',
  'audit-logs',
  'subscriptions',
  'products',
  'orders',
] as const;

export const ACTIONS = ['create', 'read', 'update', 'delete', 'manage'] as const;

export const DEFAULT_ROLES = {
  SUPER_ADMIN: 'super_admin',
  TENANT_ADMIN: 'tenant_admin',
  MANAGER: 'manager',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

export const CACHE_TTL = {
  USER_PERMISSIONS: 300,
  ROLE_PERMISSIONS: 600,
  TENANT_CONFIG: 900,
  FEATURE_FLAG: 300,
  REFRESH_TOKEN: 604800,
} as const;

export const CACHE_KEYS = {
  userPermissions: (tenantId: string, userId: string) => `perm:user:${tenantId}:${userId}`,
  rolePermissions: (tenantId: string, roleId: string) => `perm:role:${tenantId}:${roleId}`,
  tenant: (tenantId: string) => `tenant:${tenantId}`,
  session: (token: string) => `session:${token}`,
  blacklist: (jti: string) => `blacklist:${jti}`,
  rateLimit: (tenantId: string, ip: string) => `ratelimit:${tenantId}:${ip}`,
  featureFlag: (tenantId: string, flag: string) => `feature:${tenantId}:${flag}`,
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;
