---
paths:
  - 'packages/db-mysql/**'
  - 'packages/db-mongo/**'
  - 'apps/api/src/modules/**/*.service.ts'
---

# Database Rules

- Never use the bare `prisma` singleton inside a service — always call `createTenantPrisma(tenantId)`.
- All Prisma queries must use `select` or `include` explicitly — never return the full model row (avoids exposing `passwordHash` and other sensitive fields).
- Define select objects as module-level `const` with `as const`: `const USER_SELECT = { id: true, email: true } as const`.
- Use `ReadonlySet<string>` to whitelist valid `sortBy` field names before passing to `orderBy`.
- Cursor-based pagination pattern: fetch `limit + 1`, check `items.length > limit` for `hasMore`, slice to `limit`.
- Never modify existing migration files — create a new migration with `pnpm db:migrate`.
- After any `schema.prisma` change, run `pnpm db:generate` before TypeScript compilation.
- Mongoose models (in `@repo/db-mongo`) are for audit logs and document-style data only — relational data lives in MySQL/Prisma.
- Use `Promise.all([count, findMany])` for paginated list queries to avoid sequential DB round-trips.
