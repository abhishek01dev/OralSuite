Analyze $ARGUMENTS and generate comprehensive tests for it.

Steps:

1. Read the source file at $ARGUMENTS
2. Identify all exported functions, classes, and edge cases
3. Check if a test file already exists at `src/__tests__/*.test.ts` or co-located `*.test.ts`
4. Generate tests covering:
   - Happy path for each exported function/method
   - Edge cases (null/undefined, empty strings, boundary values, `noUncheckedIndexedAccess` pitfalls)
   - Error cases (Zod `safeParse()` failures, Prisma errors, missing tenant, etc.)
   - For controllers: valid DTO → success response, invalid DTO → `VALIDATION_ERROR`, missing resource → `NOT_FOUND`
   - For services: tenant-scoped queries return correct data, cross-tenant data is unreachable
5. Use Vitest patterns:
   ```typescript
   import { describe, it, expect, vi } from 'vitest';
   describe('ClassName', () => {
     describe('methodName', () => {
       it('should {behavior} when {condition}', () => { ... });
     });
   });
   ```
6. Run `pnpm --filter <package> test` to verify tests pass

Match the style of existing tests in `packages/shared/src/__tests__/` and `packages/auth/src/__tests__/`. Mock at system boundaries only (Redis, Prisma, HTTP) — not in the middle of business logic.
