# Coding Conventions

## Naming

| Thing                  | Convention                               | Example                                          |
| ---------------------- | ---------------------------------------- | ------------------------------------------------ |
| Files                  | `kebab-case`                             | `auth.service.ts`, `demo-requests.controller.ts` |
| Classes                | `PascalCase`                             | `AuthService`, `UsersController`                 |
| Interfaces / Types     | `PascalCase`                             | `TenantContext`, `PaginationParams`              |
| Functions / methods    | `camelCase`                              | `findUserByEmail`, `createTenantPrisma`          |
| Variables              | `camelCase`                              | `tenantId`, `parsedBody`                         |
| Module-level constants | `UPPER_SNAKE_CASE`                       | `CACHE_KEYS`, `HTTP_STATUS`, `USER_SELECT`       |
| Permission strings     | `resource.action` dot-notation           | `users.read`, `billing.manage`                   |
| Prisma select objects  | `UPPER_SNAKE_CASE` const with `as const` | `const USER_SELECT = { id: true } as const`      |

## File Structure

New API domain modules follow this exact layout:

```
apps/api/src/modules/{name}/
├── {name}.controller.ts   HTTP layer: validate → delegate → respond
├── {name}.service.ts      Business logic: createTenantPrisma, queries, transactions
├── {name}.routes.ts       Route registration with preHandler middleware
└── index.ts               Barrel: named re-exports only, with .js extensions
```

## Error Handling

```typescript
// Controller pattern — always use this shape
try {
  const parsed = someDto.safeParse(req.body);
  if (!parsed.success) {
    return sendError(
      reply,
      HTTP_STATUS.UNPROCESSABLE,
      'VALIDATION_ERROR',
      'Invalid data',
      parsed.error.flatten(),
    );
  }
  const result = await this.service.doThing(req.tenantId, parsed.data);
  if (!result) {
    return sendError(reply, HTTP_STATUS.NOT_FOUND, 'RESOURCE_NOT_FOUND', 'Not found');
  }
  return sendSuccess(reply, result);
} catch (error) {
  if (isPrismaError(error, 'P2002')) {
    return sendError(reply, HTTP_STATUS.CONFLICT, 'CONFLICT', 'Already exists');
  }
  throw error; // Let global error handler catch the rest
}
```

Error codes are `SCREAMING_SNAKE_CASE`. HTTP statuses come from the `HTTP_STATUS` constant in `@repo/shared`.

## Logging

- Inside route handlers: `req.log.info(...)`, `req.log.error(...)`
- Outside request context: `import { logger } from '@repo/logger'`
- Never `console.log` — ESLint blocks it; only `console.warn` and `console.error` allowed
- Log errors with context (tenant ID, user ID) — never log passwords or tokens

## API Response Format

All API responses use one of two shapes:

```typescript
// Success
{ success: true, data: T, meta?: { cursor, hasMore, total } }

// Error
{ success: false, error: { code: string, message: string, details?: unknown } }
```

Use `sendSuccess()` and `sendError()` from `apps/api/src/utils/response.ts` — never construct these manually.

## Import Ordering

1. Node built-ins (`node:path`, `node:fs`)
2. External packages (`fastify`, `zod`, `@tanstack/react-query`)
3. Workspace packages (`@repo/shared`, `@repo/auth`)
4. App-internal absolute imports (`@/lib/auth-store`, `@utils/response.js`)
5. Relative imports (`./auth.service.js`, `../plugins/auth.js`)

Always use `.js` extension for TypeScript source file imports (Node16 module resolution requirement).
Use `import type` for type-only imports (enforced by ESLint `consistent-type-imports`).
