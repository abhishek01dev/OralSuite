# Claude Code — Command Reference

Quick lookup for every command, agent, rule, and skill in this project.

---

## Slash Commands

Type these directly in the Claude Code chat.

---

### `/quick-scan`

**Use when:** Starting a work session. Returning after a break. Before a demo or deploy.

Runs typecheck → lint → tests → git status and gives a health summary.

```
/quick-scan
```

**Output:** 🟢 Good / 🟡 Needs attention / 🔴 Broken — with counts of errors per category.

---

### `/review`

**Use when:** You're done with a feature and about to open a PR.

Diffs the current branch against `main`, reads every changed file, and checks for:

- Missing `requirePermission()` on new routes
- Bare `prisma` usage instead of `createTenantPrisma()`
- Missing cache invalidation after permission/role changes
- Wrong response shape (not using `sendSuccess`/`sendError`)
- No `.js` extensions on TypeScript imports
- Missing tests for new logic

```
/review
```

> Run this before every PR, no exceptions.

---

### `/test-this <file-path>`

**Use when:** You've written a new service, controller, DTO, or utility and need tests for it.

Reads the file, finds all exports and edge cases, generates Vitest tests in the project style, then runs them.

```
/test-this apps/api/src/modules/billing/billing.service.ts

/test-this packages/shared/src/dto/appointment.ts

/test-this packages/rbac/src/pipeline.ts
```

> Always give an absolute path from the repo root.

---

### `/fix-issue <description>`

**Use when:** You know what is broken and want a structured fix with tests + typecheck.

Searches the codebase, traces the issue through the layers (route → controller → service → DB), proposes a fix, and runs `pnpm test` + `pnpm exec tsc --noEmit` + `pnpm lint` to confirm.

```
/fix-issue users.list returns data from the wrong tenant

/fix-issue 403 on GET /appointments even though user has appointments.read permission

/fix-issue pnpm build fails with "Cannot find module '@repo/config'"

/fix-issue password reset token is not deleted after use
```

> Does NOT commit — shows you the diff first.

---

### `/debug <description>`

**Use when:** Something is wrong and you don't know where in the code to look.

More exploratory than `/fix-issue`. Forms 3 hypotheses ranked by probability, traces execution, checks Redis cache keys, inspects recent git changes on relevant files, then proposes a fix.

```
/debug JWT token rejected after 5 minutes even though JWT_ACCESS_EXPIRY=15m

/debug login succeeds but req.userId is undefined on next request

/debug pnpm dev:api crashes with "Redis connection refused" on startup

/debug tenant plugin returns TENANT_NOT_FOUND for a valid tenant slug
```

> Use this when `/fix-issue` wouldn't know where to start.

---

### `/refactor <file-or-directory>`

**Use when:** A module has grown complex, has duplication, or violates layer boundaries.

**Important:** Reports first, makes zero changes until you explicitly approve. Always read the report before saying "proceed."

```
/refactor apps/api/src/modules/users

/refactor packages/rbac/src/pipeline.ts

/refactor apps/admin/src/lib/auth-store.ts
```

**Report includes:**

1. Current state
2. Issues found (complexity, duplication, naming, layer violations)
3. Proposed changes with before/after pseudocode
4. Risk assessment + what tests need updating
5. Safe execution order

---

### `/document <file-or-directory>`

**Use when:** Merging a new module, or a service/controller has no JSDoc yet.

Reads the source, writes JSDoc on public methods, documents endpoint shapes for API modules (method, path, permission required, request/response).

```
/document apps/api/src/modules/appointments/appointments.service.ts

/document packages/shared/src/dto/billing.ts

/document packages/auth/src/token-service.ts
```

> For API modules: also documents each endpoint's required permission, body shape, and response shape.

---

### `/pr`

**Use when:** Branch is ready, tests pass, and you want to open a pull request.

Reads all commits and changed files, generates a PR description with the OralSuite-specific checklist:

```
/pr
```

**Checklist it generates:**

- [ ] `pnpm test` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] New routes have `requirePermission()` middleware
- [ ] Schema changes have a migration + `pnpm db:generate` was run
- [ ] Cache invalidated for role/permission/tenant changes
- [ ] `.js` extensions on all TypeScript imports

> Will ask before running `gh pr create` — you confirm first.

---

## Agents

Invoke by asking Claude to "use the X agent" in a prompt.

---

### `reviewer` agent

**Use when:** You want deep, critical review of specific code — not just a diff.

```
Use the reviewer agent to check apps/api/src/modules/charting/

Use the reviewer agent on this controller before I merge it:
[paste code]
```

Knows every OralSuite convention. Will catch:

- Tenant isolation violations
- Missing `preHandler` middleware
- Wrong error code format
- Stale cache after mutations

---

### `architect` agent

**Use when:** Designing a new feature, evaluating if a pattern fits the architecture, or checking for layer boundary violations.

```
Use the architect agent — I want to add a notifications module to the API.
What files do I need, how do I register it, and what Prisma models are required?

Use the architect agent — is it OK to call createTenantPrisma() from inside a
Fastify plugin, or does that belong in a service?

Use the architect agent to review whether adding React Query to the widget
app violates any package boundaries.
```

**Returns:** Exact file paths, directory layout, integration points in `app.ts`, Prisma schema changes needed.

---

### `tester` agent

**Use when:** You need full test coverage for a whole module, not just one file.

```
Use the tester agent to write coverage for packages/rbac/src/

Use the tester agent — write integration tests for the auth module including
refresh token rotation and blacklisting
```

Knows:

- Mock at Prisma/Redis boundary, not inside business logic
- `PolicyContext` fixture pattern for RBAC tests
- `safeParse()` + `result.error.flatten()` pattern for DTO tests

---

## Rules (Automatic)

These activate silently when you edit matching files. No action needed.

| Rule                 | Activates on                                         | Enforces                                                                                                  |
| -------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `api-rules.md`       | `apps/api/src/modules/**`, `apps/api/src/plugins/**` | `requirePermission`, `sendError`/`sendSuccess`, `createTenantPrisma`, module file structure               |
| `db-rules.md`        | `**/*.service.ts`, `packages/db-mysql/**`            | `createTenantPrisma`, `as const` select objects, `ReadonlySet` for sort fields, cursor pagination shape   |
| `component-rules.md` | `**/*.tsx`, `packages/ui/src/**`                     | Pure UI components, `'use client'` discipline, named exports, Tailwind only, React Query for server state |
| `test-rules.md`      | `**/*.test.ts`, `**/__tests__/**`                    | Vitest imports, no `any`, descriptive `it()` names, mock at boundaries only                               |

---

## Settings (Always Active)

`.claude/settings.json` runs silently in the background.

**Auto-allowed (no prompt):**

- All `pnpm *` commands
- All `git status / diff / log / add / commit / checkout / stash` commands
- `node`, `npx`, `cat`, `ls`, `find`, `grep`, `mkdir`, `cp`, `mv`

**Auto-blocked (will never run):**

- `rm -rf /`, `rm -rf ~`, `rm -rf .`
- `sudo *`, `eval *`, `chmod 777 *`
- `git push --force`, `git reset --hard`
- `curl * | bash`, `wget * | bash`
- Reading `.env`, `.env.local`, `.env.production`, `*.pem`, `*.key`, `*secret*`, `*credential*`

**Auto-format on save:**
Prettier runs on every `.ts`, `.tsx`, `.js`, `.jsx` file after Claude writes or edits it.

---

## Decision Tree — Which Command to Use?

```
Starting a session?
  → /quick-scan

Finished writing code?
  → /test-this <file>   (add tests)
  → /review             (check conventions before PR)
  → /pr                 (when ready to merge)

Something is broken?
  → Know what's broken?   → /fix-issue <description>
  → Don't know where?     → /debug <description>

Planning new features?
  → Use architect agent

Code getting messy?
  → /refactor <path>     (see plan first, then approve)

Need docs?
  → /document <file>

Need thorough review?
  → Use reviewer agent

Need full test coverage?
  → Use tester agent
```

---

## Common Combos

**New module workflow:**

```
1. Use architect agent     → get file structure + integration plan
2. Write the code
3. /test-this <service>    → generate tests
4. /review                 → catch any convention violations
5. /document <module>      → add JSDoc
6. /pr                     → open the PR
```

**Bug fix workflow:**

```
1. /debug <symptom>        → find root cause
2. /fix-issue <desc>       → implement fix with tests
3. /review                 → confirm nothing else broke
4. /pr                     → open the PR
```

**Refactor workflow:**

```
1. /refactor <path>        → read the report
2. Approve the plan
3. Claude executes step by step, running tests after each step
4. /review                 → final check
```
