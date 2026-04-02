# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@.claude/architecture.md
@.claude/conventions.md

## About

OralSuite is a multi-tenant SaaS platform for dental clinic management. It is a **pnpm + Turborepo monorepo** with a Fastify 5 REST API, two Next.js 16 frontends (admin dashboard + client storefront), and a Vite-built embeddable widget. Data is stored in MySQL 8 (via Prisma ORM) and MongoDB 6 (via Mongoose). Redis handles caching and JWT token blacklisting. Requires **Node >=24** and **pnpm >=10**.

## Key Commands

```bash
# Dev (all apps in parallel)
pnpm dev

# Per-app dev
pnpm dev:api          # Fastify API on :3000
pnpm dev:admin        # Admin dashboard on :3001
pnpm dev:client       # Client storefront on :3002

# Build
pnpm build
pnpm clean            # Remove all dist/ and .next/

# Lint & format
pnpm lint
pnpm format
pnpm format:check

# Type-check (run from root — covers all packages)
pnpm exec tsc --noEmit

# Tests
pnpm test                              # All packages via Turborepo
pnpm --filter @repo/shared test        # Single package
pnpm exec vitest run --coverage        # With coverage

# Database (always run after schema changes)
pnpm db:generate      # Regenerate Prisma client from schema.prisma
pnpm db:migrate       # Apply pending migrations (interactive)
pnpm db:push          # Push schema without creating migration files
pnpm db:seed          # Seed roles, permissions, super admin user
```

Turborepo handles build ordering automatically based on the package dependency graph.

## Architecture

```
OralSuite/
├── apps/
│   ├── api/          @repo/api     Fastify 5 REST API — the only backend
│   │   └── src/
│   │       ├── server.ts           Entry point
│   │       ├── app.ts              Fastify app factory (registers plugins + routes)
│   │       ├── plugins/            tenant, auth, authorize, audit, error-handler
│   │       ├── modules/            Business logic: one dir per domain
│   │       │   └── {name}/         *.controller.ts  *.service.ts  *.routes.ts  index.ts
│   │       ├── routes/             Route registration (imports from modules/)
│   │       └── utils/              response.ts (sendSuccess/sendError helpers)
│   ├── admin/        @repo/admin   Next.js App Router dashboard for clinic staff
│   ├── client/       @repo/client  Next.js App Router public storefront
│   └── widget/       @repo/widget  Vite lib-mode embeddable React widget
│
└── packages/
    ├── config/       @repo/config      Zod-validated env config (source of truth for env)
    ├── shared/       @repo/shared      Types, Zod DTOs, constants (CACHE_KEYS/TTL/permissions), ApiClient
    ├── ui/           @repo/ui          Shared React components consumed by admin + client
    ├── logger/       @repo/logger      Pino (pretty dev / JSON prod)
    ├── cache/        @repo/cache       Redis service with msgpack serialization
    ├── db-mysql/     @repo/db-mysql    Prisma schema + generated client + seed script
    ├── db-mongo/     @repo/db-mongo    Mongoose models (audit logs)
    ├── auth/         @repo/auth        JWT token service + Argon2id password service
    └── rbac/         @repo/rbac        6-step authorization pipeline + policy engine
```

## Layer Rules

**Import direction (no reverse imports):**

```
config, shared, ui, logger
  ↓
cache, db-mysql, db-mongo
  ↓
auth
  ↓
rbac
  ↓
api, admin, client, widget
```

**Within the API:**

- `routes/` → registers handlers from `modules/`
- `modules/*.routes.ts` → instantiates controller, attaches `preHandler` middleware
- `modules/*.controller.ts` → validates DTO with `safeParse()`, delegates to service, calls `sendSuccess`/`sendError`
- `modules/*.service.ts` → calls `createTenantPrisma(tenantId)`, pure business logic, no HTTP types
- `plugins/` → Fastify plugins (side effects: adds hooks, decorates request/server)

**Frontend:**

- `packages/ui` components must be pure (no API calls, no stores, no side effects)
- Feature components in apps may call the `ApiClient` and use Zustand stores
- Never read `process.env` directly — import from `@repo/config`

## Coding Conventions

**Naming:**

- Files: `kebab-case` (e.g., `auth.service.ts`, `demo-requests.controller.ts`)
- Classes, interfaces, types: `PascalCase`
- Functions, variables, object keys: `camelCase`
- Constants/enums: `UPPER_SNAKE_CASE` for module-level constants (e.g., `CACHE_KEYS`, `HTTP_STATUS`)
- Prisma select objects: `UPPER_SNAKE_CASE` const (e.g., `USER_SELECT`, `USER_WITH_ROLES`)
- Permission strings: `resource.action` dot-notation (e.g., `users.read`, `billing.manage`)

**Exports:**

- All packages/modules use **named exports only** — no default exports except Next.js page components
- Barrel `index.ts` re-exports use `.js` extension: `export { Foo } from './foo.js'`
- `import type` is enforced by ESLint for type-only imports (`consistent-type-imports`)

**TypeScript:**

- Strict mode + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` — no `any` unless justified with a comment
- Inline request param interfaces in controllers (`interface IdParam { id: string }`) cast with `as`
- Zod schemas in `@repo/shared/src/dto/` with inferred types: `export type CreateUserDto = z.infer<typeof createUserDto>`
- Const assertion on Prisma select objects: `const USER_SELECT = { ... } as const`
- `ReadonlySet<string>` for validated enum-like sets (sort fields, etc.)

**Error handling:**

- Controllers: wrap each handler in try/catch; use `isPrismaError(error, 'P2002')` helper for Prisma conflicts
- Always call `sendError()` with a `SCREAMING_SNAKE_CASE` error code
- Never surface raw error messages or stack traces to clients
- Global error handler plugin catches anything not explicitly handled

**Logging:**

- Use `req.log` inside route handlers (Fastify request-scoped logger)
- Use the `@repo/logger` package everywhere else
- `console.log` is disallowed (ESLint warns); only `console.warn` / `console.error` permitted

## Testing Rules

**Framework:** Vitest 4 (`vitest run` for CI, `vitest` for watch)

**File naming:** `src/__tests__/*.test.ts` or co-located `*.test.ts` beside the source file

**Test structure:**

```typescript
import { describe, it, expect } from 'vitest';

describe('ModuleName', () => {
  describe('methodName', () => {
    it('should {expected behavior} when {condition}', () => { ... });
    it('should reject {invalid input}', () => { ... });
  });
});
```

**Mocking:** Mock at system boundaries (HTTP, Redis, DB) — not inside your own logic. Use Vitest's `vi.mock()` for module mocks; prefer real implementations for unit logic (e.g., password hashing, DTO validation).

**Coverage:** Run `pnpm exec vitest run --coverage` via `@vitest/coverage-v8`.

## Git Workflow

**Conventional Commits** enforced by Commitlint + Husky:

```
feat(api): add subscription cancellation endpoint
fix(rbac): resolve cross-tenant permission cache leak
chore: update pnpm lockfile
refactor(shared): consolidate pagination DTOs
```

Scopes align with package/app names: `api`, `admin`, `client`, `widget`, `shared`, `rbac`, `auth`, `db`, `config`, `ui`.

CI runs on push/PR to `main` and `develop`: lint → typecheck → test (with real MySQL/MongoDB/Redis) → build → Docker (main only).

## Common Pitfalls

1. **Forgetting `.js` extensions in TypeScript imports** — Node16 module resolution requires explicit `.js` even for `.ts` source files. `import { Foo } from './foo'` will fail at runtime; use `'./foo.js'`.

2. **Writing to `process.env` directly** — All environment access must go through `@repo/config`. Direct `process.env.X` reads bypass Zod validation and will cause silent failures on missing vars.

3. **Bypassing `createTenantPrisma()`** — Using the bare `prisma` client in a service will not scope queries to the current tenant, enabling cross-tenant data leaks. Always call `createTenantPrisma(tenantId)`.

4. **Missing `preHandler` on protected routes** — New routes without `{ preHandler: [requirePermission('resource.action')] }` are unauthenticated and unauthorized by default. Always add permission checks to non-public endpoints.

5. **Mutating cached permission sets** — RBAC roles and permissions are cached in Redis (TTL 5-15 min) using keys from `CACHE_KEYS.*`. After granting/revoking permissions, you must invalidate the relevant cache keys or changes won't take effect until TTL expiry.

6. **Not running `pnpm db:generate` after schema changes** — Prisma client output lives in `packages/db-mysql/src/generated/prisma/`. Editing `schema.prisma` without regenerating will cause TypeScript type errors and runtime failures.

7. **Adding `console.log` debug statements** — ESLint blocks this. Use `req.log.debug(...)` in route handlers or the `@repo/logger` package elsewhere.

8. **Cursor pagination off-by-one** — The pattern fetches `limit + 1` items, checks `items.length > limit` for `hasMore`, then slices `data = items.slice(0, limit)`. If you change the fetch size, update the slice too.

## Environment Variables

All vars are validated at startup via `@repo/config` (Zod). See `.env.example` for the full list. Key groups:

| Variable                           | Description                            |
| ---------------------------------- | -------------------------------------- |
| `DATABASE_URL`                     | Prisma MySQL connection string         |
| `MONGODB_URI`                      | Mongoose connection string             |
| `REDIS_HOST/PORT/PASSWORD/DB`      | Redis connection                       |
| `JWT_SECRET`                       | Min 32 chars; required in production   |
| `JWT_ACCESS_EXPIRY`                | Default `15m`                          |
| `JWT_REFRESH_EXPIRY`               | Default `7d`                           |
| `SUPER_ADMIN_EMAIL/PASSWORD`       | Seeded by `pnpm db:seed`               |
| `RATE_LIMIT_GLOBAL`                | Requests per minute, global            |
| `RATE_LIMIT_AUTH`                  | Requests per minute, auth endpoints    |
| `API_URL / ADMIN_URL / CLIENT_URL` | Cross-app URL references               |
| `LOG_LEVEL`                        | Pino log level (`info`, `debug`, etc.) |
