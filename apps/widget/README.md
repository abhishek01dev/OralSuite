# @repo/widget

A self-contained, embeddable product widget that can be dropped into any third-party website via a `<script>` tag. It renders a product grid for a given tenant and provides basic in-page cart functionality.

## Tech Stack

|              |                                                        |
| ------------ | ------------------------------------------------------ |
| Framework    | React 19                                               |
| Bundler      | Vite 8                                                 |
| Language     | TypeScript 5.9                                         |
| Build output | ESM (`dist/widget.es.js`) + UMD (`dist/widget.umd.js`) |

## Usage

### Via script tag (UMD build)

```html
<!-- 1. Add a container element -->
<div id="saas-widget"></div>

<!-- 2. Load the widget script -->
<script src="https://cdn.example.com/widget.umd.js"></script>

<!-- 3. Initialize -->
<script>
  SaasWidget.initWidget({
    tenantId: 'acme',
    apiUrl: 'https://api.example.com',
    containerId: 'saas-widget', // optional, defaults to "saas-widget"
  });
</script>
```

### Via ES module import

```typescript
import { initWidget } from '@repo/widget';

initWidget({
  tenantId: 'acme',
  apiUrl: 'https://api.example.com',
});
```

## `initWidget(config)` API

| Parameter     | Type     | Required | Default                 | Description                                    |
| ------------- | -------- | -------- | ----------------------- | ---------------------------------------------- |
| `tenantId`    | `string` | Yes      | —                       | Tenant identifier sent as `x-tenant-id` header |
| `apiUrl`      | `string` | No       | `http://localhost:3000` | Base URL of the `@repo/api` server             |
| `containerId` | `string` | No       | `"saas-widget"`         | ID of the DOM element to mount into            |

The widget calls `document.getElementById(containerId)` and mounts a React root into it. If the container element is not found, it logs an error and returns without mounting.

## `<Widget>` Component

The `Widget` component (`src/widget.tsx`) renders a product grid:

- Fetches products from `{apiUrl}/products?limit=6` with the `x-tenant-id` header
- Maintains an in-component cart state (product ID → quantity `Map`)
- Shows a cart badge in the header when items are added
- Handles loading and error states

## Development

In development mode (`import.meta.env.DEV`), the widget auto-mounts to a `#root` element with `tenantId="demo"`. The `index.html` in the project root provides this element.

```bash
# Start Vite dev server
pnpm dev
```

## Build Outputs

Running `pnpm build` executes `tsc && vite build` and produces two bundles in `dist/`:

| File                 | Format    | Use case                                 |
| -------------------- | --------- | ---------------------------------------- |
| `dist/widget.es.js`  | ES Module | Modern bundlers, `type="module"` scripts |
| `dist/widget.umd.js` | UMD       | Legacy `<script>` tag embeds             |

## Project Structure

```
src/
  index.tsx    # Exports initWidget(), handles dev auto-mount
  widget.tsx   # <Widget> React component (product grid + cart)
vite.config.ts # Vite library build config
```

## Scripts

```bash
# Development server
pnpm dev

# Production build (tsc type-check + Vite bundle)
pnpm build

# Preview the production build
pnpm preview

# Lint
pnpm lint
```

## Workspace Dependencies

| Package        | Purpose      |
| -------------- | ------------ |
| `@repo/shared` | Shared types |
