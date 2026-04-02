---
description: 'Quickly scan and summarize the current health of the OralSuite codebase'
---

# Quick Codebase Scan

Run this sequence and provide a concise health summary:

1. `git status` — any uncommitted changes?
2. `git log --oneline -5` — recent commits
3. `pnpm exec tsc --noEmit 2>&1 | tail -10` — type errors?
4. `pnpm lint 2>&1 | tail -10` — lint violations?
5. `pnpm test 2>&1 | tail -15` — test failures?

Summarize:

- Current branch and last commit
- Any type errors (count + files affected)
- Any lint errors (count + rules violated)
- Test pass/fail ratio
- Any uncommitted changes that look significant
- Overall health: 🟢 Good / 🟡 Needs attention / 🔴 Broken
