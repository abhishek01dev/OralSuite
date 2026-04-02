Create a pull request for the current branch.

1. Run `git diff main --stat` and `git log main..HEAD --oneline`
2. Read every changed file to understand the full scope
3. Generate a PR description:

   ## Summary

   {One paragraph: what this PR does and why}

   ## Changes

   {Bullet list grouped by area: API modules, packages, frontend}

   ## Testing

   {Tests added/updated, how to manually verify}

   ## Checklist
   - [ ] `pnpm test` passes
   - [ ] `pnpm exec tsc --noEmit` passes
   - [ ] `pnpm lint` passes
   - [ ] No `console.log` or debug code
   - [ ] New API routes have `requirePermission()` middleware
   - [ ] Schema changes have a new migration (`pnpm db:migrate`) and `pnpm db:generate` was run
   - [ ] Cache invalidation handled for roles/permissions/tenant changes
   - [ ] `.js` extensions used on all TypeScript imports

4. Output the PR description as markdown
5. Ask if I want to push and create via `gh pr create`

Commit format follows Conventional Commits: `feat(scope): description`.
