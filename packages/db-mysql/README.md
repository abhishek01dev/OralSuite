# @repo/db-mysql

MySQL relational database layer using [Prisma ORM](https://www.prisma.io/). Provides a global singleton `PrismaClient`, a **tenant-scoped client factory** that automatically injects `tenantId` into all queries, and Prisma migration/seed scripts.

## Exports

```typescript
import { prisma, createTenantPrisma, disconnectPrisma } from '@repo/db-mysql';
import type { PrismaClient } from '@repo/db-mysql';
```

| Export                         | Description                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `prisma`                       | Global singleton `PrismaClient` — use for non-tenant-scoped queries (e.g., looking up a `Tenant` by slug)    |
| `createTenantPrisma(tenantId)` | Returns a Prisma extension that automatically injects `tenantId` into all reads and writes for scoped models |
| `disconnectPrisma()`           | Gracefully disconnects the singleton — call this on process shutdown                                         |
| `PrismaClient`                 | Type re-export from the generated Prisma client                                                              |

## `createTenantPrisma(tenantId)`

The primary client for all tenant-aware database operations. Every query and mutation is automatically scoped to the provided `tenantId` without requiring manual `where: { tenantId }` clauses.

```typescript
import { createTenantPrisma } from '@repo/db-mysql';

// Instantiate a scoped client for tenant 'acme'
const db = createTenantPrisma('tenant-uuid-here');

// All queries are automatically tenant-scoped
const users = await db.user.findMany(); // WHERE tenant_id = 'tenant-uuid-here'
const user = await db.user.create({
  data: { email: 'alice@acme.com', firstName: 'Alice' /* tenantId injected automatically */ },
});
```

### Scoped Models

The following models have `tenantId` injected automatically by the extension:

| Model            | Table              |
| ---------------- | ------------------ |
| `User`           | `users`            |
| `Role`           | `roles`            |
| `RoleUser`       | `role_user`        |
| `PermissionRole` | `permission_role`  |
| `UserPermission` | `user_permissions` |
| `Department`     | `departments`      |
| `Team`           | `teams`            |
| `TeamUser`       | `team_user`        |
| `FeatureFlag`    | `feature_flags`    |
| `Subscription`   | `subscriptions`    |

Models **not** scoped: `Tenant`, `Permission`, `Module` — these are global resources.

## Schema Overview

```
Tenant (1) ─── (*) User
               (*) Role ─── (*) PermissionRole ─── (*) Permission
               (*) RoleUser (User ↔ Role pivot)
               (*) UserPermission (direct user overrides)
               (*) Department (self-referencing hierarchy, optional head User)
                     └── (*) Team (optional lead User)
                               └── (*) TeamUser (User ↔ Team pivot)
               (*) FeatureFlag
               (*) Subscription
```

### Entity Descriptions

| Model            | Description                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `Tenant`         | Top-level organisation. Each tenant is isolated — all data belongs to exactly one tenant                                              |
| `User`           | Platform user. Unique by `(tenantId, email)`. Status: `active`, `inactive`, `suspended`                                               |
| `Role`           | Named set of permissions. Unique by `(tenantId, slug)`. System roles (`isSystem: true`) cannot be deleted                             |
| `Permission`     | Atomic capability string (e.g., `users.read`). Global — shared across all tenants                                                     |
| `RoleUser`       | M:N pivot between `User` and `Role` for a specific tenant                                                                             |
| `PermissionRole` | M:N pivot between `Role` and `Permission` for a specific tenant                                                                       |
| `UserPermission` | Direct permission override per user: `grant` or `deny`, with optional expiry                                                          |
| `Department`     | Self-referencing tree structure (parent/children). Optional department head (`headUserId`)                                            |
| `Team`           | Belongs to a `Department`. Optional team lead (`leadUserId`)                                                                          |
| `TeamUser`       | M:N pivot between `User` and `Team` for a specific tenant                                                                             |
| `FeatureFlag`    | Named flag with an enabled/disabled state and optional JSON conditions. Can be tenant-specific or global (`tenantId: null`)           |
| `Subscription`   | Tenant billing subscription. Plan: `free`, `starter`, `professional`, `enterprise`. Status: `active`, `cancelled`, `expired`, `trial` |

### Enums

| Enum                 | Values                                          |
| -------------------- | ----------------------------------------------- |
| `TenantStatus`       | `active`, `suspended`, `pending`                |
| `UserStatus`         | `active`, `inactive`, `suspended`               |
| `Plan`               | `free`, `starter`, `professional`, `enterprise` |
| `PermissionOverride` | `grant`, `deny`                                 |
| `SubscriptionStatus` | `active`, `cancelled`, `expired`, `trial`       |

## Database Scripts

Run from the monorepo root:

```bash
# Regenerate Prisma client after schema changes
pnpm db:generate

# Create and apply a new migration
pnpm db:migrate

# Push schema changes directly (no migration file — dev only)
pnpm --filter @repo/db-mysql exec prisma db push

# Seed: creates default roles, permissions, system modules, and super admin user
pnpm db:seed
```

Or from the package directory:

```bash
cd packages/db-mysql

npx prisma generate
npx prisma migrate dev --name <migration-name>
npx prisma studio   # GUI database browser
```

## Environment Variables

| Variable       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `DATABASE_URL` | MySQL connection URL: `mysql://user:pass@host:port/db` |

## Workspace Dependencies

| Package        | Purpose                      |
| -------------- | ---------------------------- |
| `@repo/config` | `databaseConfig.databaseUrl` |
