Analyze $ARGUMENTS for refactoring opportunities.

DO NOT make changes yet. First produce a report:

1. **Current State**: What the code does and its structure
2. **Issues Found**: Complexity, duplication, naming violations, layer boundary violations (e.g., HTTP types leaking into services), missing `as const` on select objects, improper tenant scoping
3. **Proposed Changes**: For each issue — before/after pseudocode, which files affected
4. **Risk Assessment**: What could break? Which tests need updating? Any cache invalidation implications?
5. **Execution Order**: Safest order (smallest/safest first, schema changes last)

After I approve, execute step by step. After each step:

- Run `pnpm --filter <package> test`
- Run `pnpm exec tsc --noEmit`

Never change the public API of a `@repo/*` package without updating all consumers.
