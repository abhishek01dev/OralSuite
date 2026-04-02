# Architecture Overview

## System Diagram

```
                          ┌─────────────────┐
                          │   Client App    │  Next.js :3002
                          │  (@repo/client) │
                          └────────┬────────┘
                                   │ fetch (ApiClient)
                          ┌────────┴────────┐
Browser / Embedded        │   Admin App     │  Next.js :3001
                          │  (@repo/admin)  │
                          └────────┬────────┘
                                   │ fetch (ApiClient)
                          ┌────────┴────────┐    ┌─────────────┐
                          │  Fastify API    │───▶│ Redis 7     │ tokens, perms
                          │  (@repo/api)    │    │ (@repo/cache│ cache, blacklist
                          │  :3000          │    └─────────────┘
                          └──┬──────────┬───┘
                             │          │
                    ┌────────┴──┐  ┌────┴──────────┐
                    │ MySQL 8   │  │  MongoDB 6    │
                    │ (Prisma)  │  │  (Mongoose)   │
                    │ @repo/    │  │  @repo/       │
                    │ db-mysql  │  │  db-mongo     │
                    └───────────┘  └───────────────┘
                     Core data      Audit logs
```

## Request Flow

```
HTTP Request
  │
  ▼
Tenant Plugin        ← resolves x-tenant-id header, fetches TenantContext (cached in Redis)
  │
  ▼
Auth Plugin          ← verifies Bearer JWT, decorates req.userId / req.tenantId / req.jwtPayload
  │
  ▼
Route Handler
  │
  ▼
requirePermission()  ← RBAC 6-step pipeline (roles → merge perms → tenant isolation → policy)
  │
  ▼
Controller           ← safeParse(req.body) via Zod DTO, call service, sendSuccess/sendError
  │
  ▼
Service              ← createTenantPrisma(tenantId), business logic, DB queries
  │
  ▼
Response             ← { success: true, data, meta? } or { success: false, error: { code, message } }
```

## Key Design Decisions

- **Dual database strategy**: MySQL for relational/transactional data (users, appointments, billing), MongoDB for high-volume append-only audit logs that don't need joins.
- **Cursor-based pagination everywhere**: Avoids the COUNT(\*) + OFFSET performance cliff at scale. Always fetch `limit + 1` to determine `hasMore`.
- **Permissions cached in Redis**: Roles and permissions are hot-path data — cached for 5-15 minutes per tenant/user. This means permission changes have up to TTL lag; cache must be invalidated on mutations.
- **`@repo/config` as env gate**: All `process.env` access is funneled through Zod validation at startup. Apps fail fast with clear error messages on misconfiguration rather than silently using `undefined`.
- **Turborepo build pipeline**: Package dependency order is encoded in `turbo.json` — `build` tasks declare `"dependsOn": ["^build"]` so packages always build before their consumers.

## Module Boundaries

```
Allowed import direction (→ = can import):

config    → (no imports from this repo)
shared    → (no imports from this repo)
logger    → (no imports from this repo)
ui        → shared
cache     → config, logger
db-mysql  → config, logger
db-mongo  → config, logger
auth      → config, logger, cache
rbac      → config, logger, cache, db-mysql, shared
api       → all packages
admin     → shared, ui, config
client    → shared, ui, config
widget    → shared, ui
```

**Forbidden:** apps importing from other apps; packages importing from apps; `db-mysql` importing from `rbac` or `auth`.
