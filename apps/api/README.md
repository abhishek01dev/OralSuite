# @repo/api

The core REST API for the SaaS platform. Built with **Fastify 5**, it handles multi-tenant authentication, RBAC, user/role/tenant management, feature flags, audit logging, and subscriptions.

## Tech Stack

|            |                                                                              |
| ---------- | ---------------------------------------------------------------------------- |
| Framework  | Fastify 5                                                                    |
| Language   | TypeScript 5.9 (strict)                                                      |
| Database   | MySQL via `@repo/db-mysql` (Prisma), MongoDB via `@repo/db-mongo` (Mongoose) |
| Cache      | Redis via `@repo/cache`                                                      |
| Auth       | JWT via `@repo/auth`, RBAC via `@repo/rbac`                                  |
| Validation | Zod (`@repo/shared` DTOs)                                                    |
| Logging    | Pino via `@repo/logger`                                                      |
| Dev runner | tsx watch                                                                    |
| Build      | tsc + tsc-alias                                                              |

## Architecture

```
server.ts          ← entry point: starts listener, handles SIGINT/SIGTERM
  └── app.ts       ← buildApp() factory: connects services, registers all plugins + routes
        ├── plugins/
        │   ├── tenant.ts         ← resolves x-tenant-id header → TenantContext
        │   ├── auth.ts           ← JWT verification + token blacklist check
        │   ├── audit.ts          ← writes AuditLog to MongoDB on mutating requests
        │   ├── authorize.ts      ← requirePermission() decorator for route guards
        │   └── error-handler.ts  ← global error handler (Zod + Fastify errors)
        └── routes/
              └── index.ts        ← registers all modules under /api/v1
```

### Request Lifecycle

```mermaid
graph LR
  Request --> tenantPlugin["tenant plugin\n(resolves tenantId)"]
  tenantPlugin --> authPlugin["auth plugin\n(verifies JWT)"]
  authPlugin --> handler["route handler\n(controller)"]
  handler --> auditPlugin["audit plugin\n(onResponse hook)"]
  auditPlugin --> Response
```

### App Factory Pattern

`buildApp()` in `src/app.ts` returns a fully configured `FastifyInstance`. This separates all application wiring from the HTTP listener, making the app trivially testable — just call `buildApp()` in tests without binding to a port.

`server.ts` is intentionally minimal:

```typescript
const app = await buildApp();
process.on('SIGTERM', () => app.close());
await app.listen({ port: appConfig.port, host: '0.0.0.0' });
```

## API Modules

All routes are registered under the `/api/v1` prefix.

| Module        | Prefix                  | Description                                        |
| ------------- | ----------------------- | -------------------------------------------------- |
| Auth          | `/api/v1/auth`          | Login, logout, refresh token, current user (`/me`) |
| Users         | `/api/v1/users`         | User CRUD, role assignment, permission overrides   |
| Roles         | `/api/v1/roles`         | Role CRUD, permission assignment                   |
| Permissions   | `/api/v1/permissions`   | List all system permissions                        |
| Tenants       | `/api/v1/tenants`       | Tenant CRUD                                        |
| Departments   | `/api/v1/departments`   | Hierarchical department management                 |
| Teams         | `/api/v1/teams`         | Team management, member add/remove                 |
| Feature Flags | `/api/v1/feature-flags` | Feature flag CRUD + toggle                         |
| Audit Logs    | `/api/v1/audit-logs`    | Paginated audit log query (MongoDB)                |
| Subscriptions | `/api/v1/subscriptions` | Subscription management                            |

### Health Check

```
GET /health
```

Returns `{ status: "ok", timestamp: "..." }`. Does not require authentication.

## Plugins

### `tenant.ts`

Reads the `x-tenant-id` header on every request. For public paths (`/health`, `/api/v1/auth/*`) it is skipped. Resolves the tenant from MySQL and caches it in Redis. Attaches `TenantContext` to the Fastify request object.

### `auth.ts`

Verifies the `Authorization: Bearer <token>` JWT on every non-public request. Checks the JTI against the Redis blacklist. Attaches `AuthenticatedUser` to the request.

### `audit.ts`

Buffers write operations (`POST`, `PUT`, `PATCH`, `DELETE`) in an in-memory queue. Flushes the buffer to the MongoDB `audit_logs` collection on an `onResponse` hook. Gracefully flushed on `onClose`.

### `authorize.ts`

Provides the `requirePermission(permission)` decorator. Uses `@repo/rbac`'s `AuthorizationPipeline` to run the 6-step check: roles → permissions → overrides → tenant isolation → policy rules.

### `error-handler.ts`

Catches all errors and returns a standardised `ApiResponse<never>` with the appropriate HTTP status code.

## Workspace Dependencies

| Package          | Purpose                              |
| ---------------- | ------------------------------------ |
| `@repo/auth`     | TokenService + PasswordService       |
| `@repo/cache`    | Redis cache                          |
| `@repo/config`   | Env config (port, JWT, DB URLs)      |
| `@repo/db-mongo` | MongoDB models (AuditLog)            |
| `@repo/db-mysql` | Prisma client + `createTenantPrisma` |
| `@repo/logger`   | Pino logger instance                 |
| `@repo/rbac`     | AuthorizationPipeline                |
| `@repo/shared`   | Types, DTOs (Zod), CACHE_KEYS        |

## Environment Variables

| Variable             | Default                                        | Description                        |
| -------------------- | ---------------------------------------------- | ---------------------------------- |
| `NODE_ENV`           | `development`                                  | Environment                        |
| `PORT`               | `3000`                                         | HTTP listen port                   |
| `API_URL`            | `http://localhost:3000`                        | Public API base URL                |
| `ADMIN_URL`          | `http://localhost:3001`                        | Admin app URL (CORS)               |
| `CLIENT_URL`         | `http://localhost:3002`                        | Client app URL (CORS)              |
| `CORS_ORIGINS`       | `ADMIN_URL,CLIENT_URL`                         | Comma-separated CORS origins       |
| `RATE_LIMIT_GLOBAL`  | `1000`                                         | Global rate limit (req/min)        |
| `RATE_LIMIT_AUTH`    | `10`                                           | Auth endpoint rate limit (req/min) |
| `DATABASE_URL`       | `mysql://root:password@localhost:3306/saas_db` | MySQL connection URL               |
| `MONGODB_URI`        | `mongodb://localhost:27017/saas_db`            | MongoDB connection URI             |
| `REDIS_HOST`         | `localhost`                                    | Redis host                         |
| `REDIS_PORT`         | `6379`                                         | Redis port                         |
| `REDIS_PASSWORD`     | —                                              | Redis password (optional)          |
| `REDIS_DB`           | `0`                                            | Redis database index               |
| `REDIS_KEY_PREFIX`   | `saas:`                                        | Key namespace prefix               |
| `JWT_SECRET`         | —                                              | **Required.** Min 32 characters    |
| `JWT_ACCESS_EXPIRY`  | `15m`                                          | Access token expiry                |
| `JWT_REFRESH_EXPIRY` | `7d`                                           | Refresh token expiry               |

## Scripts

```bash
# Development (hot reload via tsx watch)
pnpm dev

# Production build (tsc + tsc-alias for path rewriting)
pnpm build

# Lint
pnpm lint
```

## Path Aliases

The tsconfig defines the following path aliases, rewritten at build time by `tsc-alias`:

| Alias        | Resolves to     |
| ------------ | --------------- |
| `@modules/*` | `src/modules/*` |
| `@plugins/*` | `src/plugins/*` |
| `@utils/*`   | `src/utils/*`   |
