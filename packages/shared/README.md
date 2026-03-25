# @repo/shared

Universal package used by every app and package in the monorepo. Provides TypeScript types, system constants, Zod validation schemas (DTOs), and the `ApiClient` HTTP client used by frontend apps.

## Exports

```typescript
import { ... } from '@repo/shared';
```

---

## 1. Types (`src/types/`)

```typescript
import type {
  TenantContext,
  AuthenticatedUser,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  Permission,
  Role,
  UserPermissionOverride,
  PermissionAction,
  PermissionString,
  TenantStatus,
  UserStatus,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@repo/shared';
```

| Type                     | Description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `TenantContext`          | `{ tenantId, tenantSlug, tenantPlan }` — attached to every API request by the tenant plugin |
| `AuthenticatedUser`      | `{ id, tenantId, email, roles[], permissions[] }` — attached to every authenticated request |
| `PaginationParams`       | `{ cursor?, limit, sortBy?, sortOrder? }` — cursor-based pagination input                   |
| `PaginatedResponse<T>`   | `{ data: T[], meta: { cursor, hasMore, total? } }` — standard paginated API response        |
| `ApiResponse<T>`         | `{ success, data?, error?, meta? }` — standard API response envelope                        |
| `Permission`             | `{ id, name, description, module }`                                                         |
| `Role`                   | `{ id, tenantId, name, slug, description, isSystem, permissions[] }`                        |
| `UserPermissionOverride` | `{ permissionId, permissionName, type, expiresAt }`                                         |
| `PermissionAction`       | `'create' \| 'read' \| 'update' \| 'delete' \| 'manage'`                                    |
| `PermissionString`       | Template literal: `` `${string}.${PermissionAction}` `` (e.g., `"users.read"`)              |
| `TenantStatus`           | `'active' \| 'suspended' \| 'pending'`                                                      |
| `UserStatus`             | `'active' \| 'inactive' \| 'suspended'`                                                     |
| `SubscriptionPlan`       | `'free' \| 'starter' \| 'professional' \| 'enterprise'`                                     |
| `SubscriptionStatus`     | `'active' \| 'cancelled' \| 'expired' \| 'trial'`                                           |

---

## 2. Constants (`src/constants/`)

```typescript
import {
  SYSTEM_PERMISSIONS,
  MODULES,
  ACTIONS,
  DEFAULT_ROLES,
  CACHE_TTL,
  CACHE_KEYS,
  PAGINATION,
  HTTP_STATUS,
} from '@repo/shared';
```

### `SYSTEM_PERMISSIONS`

```typescript
{
  BYPASS_POLICIES: 'system.bypass_policies', // Super admin — bypasses all policy checks
  MANAGE_TENANTS:  'tenants.manage',
}
```

### `MODULES`

Array of all platform module names: `'users'`, `'roles'`, `'permissions'`, `'tenants'`, `'departments'`, `'teams'`, `'feature-flags'`, `'audit-logs'`, `'subscriptions'`, `'products'`, `'orders'`.

### `ACTIONS`

`['create', 'read', 'update', 'delete', 'manage']`

### `DEFAULT_ROLES`

```typescript
{
  SUPER_ADMIN:   'super_admin',
  TENANT_ADMIN:  'tenant_admin',
  MANAGER:       'manager',
  MEMBER:        'member',
  VIEWER:        'viewer',
}
```

### `CACHE_TTL` (seconds)

| Key                | Value    | Description                        |
| ------------------ | -------- | ---------------------------------- |
| `USER_PERMISSIONS` | `300`    | 5 min — merged user permission set |
| `ROLE_PERMISSIONS` | `600`    | 10 min — permissions for a role    |
| `TENANT_CONFIG`    | `900`    | 15 min — resolved tenant config    |
| `FEATURE_FLAG`     | `300`    | 5 min — feature flag state         |
| `REFRESH_TOKEN`    | `604800` | 7 days — refresh token session     |

### `CACHE_KEYS`

Key builder functions (all return strings):

```typescript
CACHE_KEYS.userPermissions(tenantId, userId); // 'perm:user:{tenantId}:{userId}'
CACHE_KEYS.rolePermissions(tenantId, roleId); // 'perm:role:{tenantId}:{roleId}'
CACHE_KEYS.tenant(tenantId); // 'tenant:{tenantId}'
CACHE_KEYS.session(token); // 'session:{token}'
CACHE_KEYS.blacklist(jti); // 'blacklist:{jti}'
CACHE_KEYS.rateLimit(tenantId, ip); // 'ratelimit:{tenantId}:{ip}'
CACHE_KEYS.featureFlag(tenantId, flag); // 'feature:{tenantId}:{flag}'
```

### `PAGINATION`

```typescript
{ DEFAULT_LIMIT: 20, MAX_LIMIT: 100 }
```

### `HTTP_STATUS`

Named HTTP status code constants: `OK` (200), `CREATED` (201), `NO_CONTENT` (204), `BAD_REQUEST` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `UNPROCESSABLE` (422), `TOO_MANY_REQUESTS` (429), `INTERNAL_ERROR` (500).

---

## 3. DTOs — Zod Schemas (`src/dto/`)

All DTOs are Zod schemas with inferred TypeScript types exported alongside them.

```typescript
import { createUserDto, loginDto, createRoleDto /* ... */ } from '@repo/shared';
import type { CreateUserDto, LoginDto, CreateRoleDto /* ... */ } from '@repo/shared';
```

| Schema                      | Inferred Type               | Description                                   |
| --------------------------- | --------------------------- | --------------------------------------------- |
| `paginationSchema`          | `PaginationDto`             | Query params for paginated list endpoints     |
| `createTenantDto`           | `CreateTenantDto`           | Create a new tenant                           |
| `updateTenantDto`           | `UpdateTenantDto`           | Update tenant (all fields optional)           |
| `createUserDto`             | `CreateUserDto`             | Register a new user with email/password       |
| `updateUserDto`             | `UpdateUserDto`             | Update user profile and status                |
| `loginDto`                  | `LoginDto`                  | Email + password login                        |
| `createRoleDto`             | `CreateRoleDto`             | Create a role with optional permissions       |
| `updateRoleDto`             | `UpdateRoleDto`             | Update role (all fields optional)             |
| `assignPermissionsDto`      | `AssignPermissionsDto`      | Assign a set of permissions to a role         |
| `userPermissionOverrideDto` | `UserPermissionOverrideDto` | Grant or deny a specific permission to a user |
| `createDepartmentDto`       | `CreateDepartmentDto`       | Create a department (with optional parent)    |
| `updateDepartmentDto`       | `UpdateDepartmentDto`       | Update department                             |
| `createTeamDto`             | `CreateTeamDto`             | Create a team (must belong to a department)   |
| `updateTeamDto`             | `UpdateTeamDto`             | Update team                                   |
| `createFeatureFlagDto`      | `CreateFeatureFlagDto`      | Create a feature flag                         |
| `updateFeatureFlagDto`      | `UpdateFeatureFlagDto`      | Update feature flag                           |

---

## 4. `ApiClient` & `ApiError`

The `ApiClient` is a typed HTTP client used by `@repo/admin` and `@repo/client` to communicate with the REST API. It automatically injects the `Authorization` header and `x-tenant-id` header on every request.

```typescript
import { ApiClient, ApiError } from '@repo/shared';

const api = new ApiClient('http://localhost:3000');
api.setTenantId('acme');

// GET
const users = await api.get<ApiResponse<User[]>>('/api/v1/users');

// POST
const result = await api.post<ApiResponse<User>>('/api/v1/users', {
  email: '...',
  password: '...',
});

// Error handling
try {
  await api.get('/api/v1/users/not-found');
} catch (err) {
  if (err instanceof ApiError) {
    console.error(err.status, err.code, err.message);
  }
}
```

### `ApiClient` Methods

| Method                      | Signature              | Description                                          |
| --------------------------- | ---------------------- | ---------------------------------------------------- |
| `detectTenant()`            | `() => void`           | Auto-detects tenant from subdomain or `localStorage` |
| `setTenantId(id)`           | `(string) => void`     | Manually set the tenant ID                           |
| `getTenantId()`             | `() => string \| null` | Get the current tenant ID                            |
| `get<T>(endpoint, params?)` |                        | GET request with optional query params               |
| `post<T>(endpoint, body?)`  |                        | POST request with JSON body                          |
| `put<T>(endpoint, body?)`   |                        | PUT request with JSON body                           |
| `patch<T>(endpoint, body?)` |                        | PATCH request with JSON body                         |
| `delete<T>(endpoint)`       |                        | DELETE request                                       |

### `ApiError`

Thrown by `ApiClient` when the HTTP response is not `2xx`:

```typescript
class ApiError extends Error {
  status: number; // HTTP status code
  code?: string; // API error code from the response body
}
```

## Package Entry Points

| Consumer                             | Resolved entry                          |
| ------------------------------------ | --------------------------------------- |
| TypeScript (type checking)           | `src/index.ts` (full TypeScript source) |
| Next.js / Bundlers (Turbopack, Vite) | `dist/index.js` (compiled JavaScript)   |

The dual entry is configured in `package.json` via the `exports` field and ensures Turbopack can resolve the `.js` imports in `src/index.ts` without TypeScript's `.js` → `.ts` trick.
