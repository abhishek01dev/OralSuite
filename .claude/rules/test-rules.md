---
paths:
  - '**/*.test.ts'
  - '**/*.test.tsx'
  - '**/__tests__/**'
---

# Test File Rules

- Use Vitest imports: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'`
- Test names must describe behavior: `it('should return 404 when user does not exist', ...)`
- No `any` in test data — type all fixtures fully
- No `test.skip` or `it.skip` without a comment linking to an issue: `// TODO: fix after #123`
- Clean up side effects in `afterEach` — no state leaking between tests
- Assert specific values: `.toBe(42)` over `.toBeTruthy()`, `.toEqual({...})` over `.toBeDefined()`
- Mock at system boundaries only: Prisma client, Redis cache, external HTTP. Do not mock your own module's internal functions.
- For DTO tests: use `safeParse()` and check `result.success` + `result.error.flatten()` for field errors
- For policy tests: use `PolicyContext` with explicit `userId`, `tenantId`, `resourceOwnerId` fixtures to test allow/deny branches
- One test file per source module — co-located or in `src/__tests__/`
