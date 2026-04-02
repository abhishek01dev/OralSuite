---
paths:
  - 'packages/ui/src/**'
  - 'apps/admin/src/components/**'
  - 'apps/client/src/components/**'
  - 'apps/admin/src/app/**/*.tsx'
  - 'apps/client/src/app/**/*.tsx'
---

# Component Rules

- `packages/ui` components must be pure: no API calls, no Zustand stores, no side effects. They receive data via props only.
- Feature components in `apps/admin` and `apps/client` may use Zustand (`useAuthStore`) and `ApiClient`, but must not contain business logic — delegate to services/hooks.
- Next.js server components are the default. Add `'use client'` only when the component needs browser APIs, event handlers, or `useState`/`useEffect`.
- Page components (`app/**/page.tsx`) use default exports. All other components use named exports.
- Props interfaces use `interface`, not `type`: `interface ButtonProps { ... }`.
- `@tanstack/react-query` (`useQuery`, `useMutation`) for server state; Zustand only for client-side global state (auth, tenant context).
- `react-hook-form` + `@hookform/resolvers/zod` for all forms — do not manage form state manually with `useState`.
- Tailwind CSS v4 for styling — no inline styles, no CSS modules unless absolutely necessary.
- `QueryClient` default options: `staleTime: 30_000`, `retry: 1` (set in `providers.tsx` — do not override per-query without good reason).
