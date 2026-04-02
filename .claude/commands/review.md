Review the changes in the current branch compared to main. Start by running `git diff main --name-only` then read each changed file.

For each changed file check:

1. **Bugs & logic errors** — off-by-one errors, unchecked nulls (`noUncheckedIndexedAccess` is on), incorrect async/await
2. **OralSuite conventions** — named exports, `.js` extensions on imports, `createTenantPrisma()` for DB access, `sendSuccess`/`sendError` response shape, `import type` for type-only imports
3. **Authorization** — new API routes must have `{ preHandler: [requirePermission('resource.action')] }` unless intentionally public
4. **Tenant isolation** — no bare `prisma` client usage in services; all queries must go through `createTenantPrisma(tenantId)`
5. **Cache invalidation** — if roles/permissions/tenant data changes, relevant `CACHE_KEYS.*` entries must be invalidated
6. **Error handling** — controllers must use `safeParse()` for DTO validation and catch Prisma errors (`isPrismaError(error, 'P2002')` for conflicts)
7. **Security** — no secrets in code, no `console.log` leaking data, parameterized queries only (Prisma enforces this, but check raw queries in Mongoose)
8. **Tests** — business logic changes need corresponding test updates; new modules need at least DTO and service tests

For each issue:

- **File**: path:line
- **Severity**: 🔴 Critical / 🟡 Warning / 🔵 Suggestion
- **Issue**: what's wrong
- **Fix**: how to fix it

Do NOT approve output with Critical severity issues unresolved.
