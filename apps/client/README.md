# @repo/client

The customer-facing storefront for the SaaS platform. Built with **Next.js 16 App Router**, it allows end users to browse products, manage their cart, check out, and authenticate.

## Tech Stack

|              |                                    |
| ------------ | ---------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack) |
| Language     | TypeScript 5.9 (strict)            |
| Styling      | Tailwind CSS v4                    |
| Server state | TanStack Query v5                  |
| Client state | Zustand v5                         |
| HTTP client  | `ApiClient` from `@repo/shared`    |
| Components   | `@repo/ui`                         |

## Pages & Routes

```
/              — Homepage / landing
/products      — Product catalog (fetches tenant-scoped products)
/cart          — Shopping cart view (Zustand cart state)
/checkout      — Checkout flow
/login         — User login
/register      — User registration
```

## Project Structure

```
src/
  app/
    layout.tsx           # Root layout
    page.tsx             # Homepage
    providers.tsx        # TanStack Query provider + auth bootstrap
    products/page.tsx    # Product catalog
    cart/page.tsx        # Cart view
    checkout/page.tsx    # Checkout flow
    login/page.tsx       # Login form (wrapped in Suspense for useSearchParams)
    register/page.tsx    # Registration form (wrapped in Suspense for useSearchParams)
  components/
    navbar.tsx           # Top navigation bar with cart count + auth state
  lib/
    api.ts               # ApiClient instance (reads NEXT_PUBLIC_API_URL)
    auth-store.ts        # Zustand store: login / logout / register / fetchUser
    cart-store.ts        # Zustand store: add / remove / clear cart items
  config.ts              # Static app configuration
```

## State Management

### Auth Store (`lib/auth-store.ts`)

Zustand store that manages authentication state:

| Action                   | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| `login(email, password)` | POST `/api/v1/auth/login`, stores tokens in `localStorage` |
| `register(data)`         | POST `/api/v1/auth/register`, auto-logs in on success      |
| `logout()`               | POST `/api/v1/auth/logout`, clears tokens and state        |
| `fetchUser()`            | GET `/api/v1/auth/me`, hydrates user from existing token   |
| `bootstrap()`            | Called on app start — calls `fetchUser()` if token exists  |

### Cart Store (`lib/cart-store.ts`)

Zustand store that manages the client-side shopping cart:

| State/Action                     | Description                |
| -------------------------------- | -------------------------- |
| `items`                          | `Map<productId, quantity>` |
| `addItem(productId)`             | Increment quantity by 1    |
| `removeItem(productId)`          | Remove from cart           |
| `updateQuantity(productId, qty)` | Set exact quantity         |
| `clearCart()`                    | Empty the cart             |
| `totalCount`                     | Sum of all item quantities |

## Multi-Tenancy

The tenant is resolved from:

1. `localStorage.tenantId` (set after first detection)
2. The subdomain of the current hostname (e.g., `acme.myapp.com` → `tenantId = "acme"`)
3. `NEXT_PUBLIC_TENANT_ID` env var override (useful for local development)

The resolved tenant ID is sent as the `x-tenant-id` header on every API request.

## Workspace Dependencies

| Package        | Purpose                               |
| -------------- | ------------------------------------- |
| `@repo/shared` | `ApiClient`, types, constants, DTOs   |
| `@repo/ui`     | `Button`, `Input`, `Badge`, `Tooltip` |

## Environment Variables

| Variable                | Default                 | Description                        |
| ----------------------- | ----------------------- | ---------------------------------- |
| `NEXT_PUBLIC_API_URL`   | `http://localhost:3000` | Base URL of the `@repo/api` server |
| `NEXT_PUBLIC_TENANT_ID` | —                       | Override tenant ID for local dev   |

Create a `.env.local` file in `apps/client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_TENANT_ID=demo
```

## Scripts

```bash
# Development (Turbopack, port 3002)
pnpm dev

# Production build
pnpm build

# Lint
pnpm lint
```
