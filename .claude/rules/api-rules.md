---
paths:
  - 'apps/api/src/modules/**'
  - 'apps/api/src/routes/**'
  - 'apps/api/src/plugins/**'
---

# API Module Rules

- Every route handler must validate its request body with `safeParse()` from the corresponding DTO in `@repo/shared`. Never trust raw `req.body`.
- Use `sendSuccess(reply, data, HTTP_STATUS.*)` and `sendError(reply, status, 'ERROR_CODE', 'message')` from `apps/api/src/utils/response.ts` — never call `reply.send()` directly.
- All non-public routes must declare `{ preHandler: [requirePermission('resource.action')] }`. If a route is intentionally public, add a comment explaining why.
- Services must receive `tenantId` as a parameter and call `createTenantPrisma(tenantId)` — never use the global `prisma` singleton in a service.
- Check resource existence before mutation: fetch the record first, return `NOT_FOUND` if missing, then proceed.
- Wrap multi-table writes in `db.$transaction([...])`.
- Handle Prisma constraint errors explicitly: `isPrismaError(error, 'P2002')` → `CONFLICT`.
- New modules require all four files: `*.controller.ts`, `*.service.ts`, `*.routes.ts`, `index.ts`.
- Register new route files in `apps/api/src/app.ts` (or the central route registration file).
- Rate limiting is configured globally — flag any endpoint that needs stricter limits (e.g., auth endpoints use `RATE_LIMIT_AUTH`).
