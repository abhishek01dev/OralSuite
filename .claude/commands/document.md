Generate or update documentation for $ARGUMENTS.

1. Read the source file(s)
2. For each exported function/class/type:
   - Description of what it does
   - Parameters with types
   - Return values
   - Side effects (cache mutations, DB writes, emitted events)
   - Usage example
3. For API modules (`apps/api/src/modules/`): document each endpoint with method, path, required permission, request body shape, and response shape using the standard `{ success, data, meta }` / `{ success, error }` format
4. If a doc file already exists, update it — preserve manually written sections
5. Match documentation style:
   - API modules → JSDoc on public service methods + inline comments on non-obvious logic
   - Shared types/DTOs → JSDoc on the Zod schema or interface
   - React components in `@repo/ui` → JSDoc on the component function with prop descriptions

Do NOT add JSDoc to trivial getters or obvious one-liners.
