Help me debug: $ARGUMENTS

Steps:

1. Restate the problem — expected vs. actual behavior, any error message/stack trace
2. Search for relevant code: `Grep` for the error code, route path, or function name
3. Read the relevant files: start at the route → controller → service → DB layer
4. Form 3 hypotheses ranked by probability; for each, describe how to verify
5. Start with the most likely cause:
   - Check tenant scoping (`createTenantPrisma` vs bare `prisma`)
   - Check RBAC pipeline step in error response (`step` field in 403 body)
   - Check Redis cache for stale permission data (`CACHE_KEYS.*`)
   - Check Zod DTO mismatch between `@repo/shared` schema and what the client sends
   - Check `.js` import extensions in the affected module
   - Run `git log --oneline -10 -- {relevant_files}` to find recent changes
6. Once root cause is identified, propose a fix
7. Implement the fix, add a regression test, run `pnpm test`

Show reasoning at each step. Do not jump to conclusions.
