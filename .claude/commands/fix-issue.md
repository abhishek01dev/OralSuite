Fix the issue described in: $ARGUMENTS

Workflow:

1. Understand the issue fully — restate expected vs. actual behavior
2. Search the codebase: `Grep` for relevant error codes, function names, or route paths
3. Read the relevant source files (module controller → service → shared DTO if applicable)
4. Create a fix plan — list which files change and what changes
5. Implement the fix:
   - Controllers: validate with `safeParse()`, use `sendError()` with correct HTTP status and `SCREAMING_SNAKE_CASE` code
   - Services: use `createTenantPrisma(tenantId)`, wrap multi-table writes in `$transaction([])`
   - If schema changes: update `packages/db-mysql/prisma/schema.prisma` and run `pnpm db:generate`
6. Add or update tests to cover the fix
7. Run `pnpm --filter <affected-package> test` — confirm passing
8. Run `pnpm exec tsc --noEmit` — confirm no type errors
9. Run `pnpm lint` — confirm no lint violations

Do NOT commit. Show all diffs and let me review first.
