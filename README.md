# SaaS Monorepo

A production-ready, multi-tenant SaaS platform built as a monorepo. It includes a Fastify REST API, two Next.js frontends (admin dashboard + customer storefront), an embeddable widget, and a suite of shared packages for auth, RBAC, caching, database access, and more.

## Tech Stack

| Layer            | Technology                                         |
| ---------------- | -------------------------------------------------- |
| Monorepo tooling | pnpm workspaces, Turborepo                         |
| Language         | TypeScript 5.9 (strict)                            |
| API              | Fastify 5                                          |
| Frontends        | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| Widget           | Vite 8, React 19                                   |
| Relational DB    | MySQL via Prisma ORM                               |
| Document DB      | MongoDB via Mongoose                               |
| Cache            | Redis via ioredis (msgpack serialization)          |
| Auth             | JWT (jsonwebtoken), argon2 password hashing        |
| Testing          | Vitest                                             |
| Linting          | ESLint 10, Prettier                                |
| Git hooks        | Husky + lint-staged, Commitlint                    |

## Requirements

- Node.js >= 24.0.0
- pnpm >= 10.0.0
- MySQL 8+
- MongoDB 6+
- Redis 7+

## Workspace Structure

```
monorepo/
├── apps/
│   ├── api/        @repo/api     — Fastify REST API (port 3000)
│   ├── admin/      @repo/admin   — Admin dashboard Next.js app (port 3001)
│   ├── client/     @repo/client  — Customer storefront Next.js app (port 3002)
│   └── widget/     @repo/widget  — Embeddable product widget (Vite)
└── packages/
    ├── auth/       @repo/auth      — JWT token service + argon2 password hashing
    ├── cache/      @repo/cache     — Redis cache service (msgpack)
    ├── config/     @repo/config    — Zod-validated environment configuration
    ├── db-mongo/   @repo/db-mongo  — Mongoose ODM models (audit logs, etc.)
    ├── db-mysql/   @repo/db-mysql  — Prisma ORM client + tenant-scoped queries
    ├── logger/     @repo/logger    — Pino logger (pretty dev / JSON prod)
    ├── rbac/       @repo/rbac      — Authorization pipeline + policy engine
    ├── shared/     @repo/shared    — Types, constants, DTOs (Zod), ApiClient
    └── ui/         @repo/ui        — Shared React component library
```

## Dependency Graph

```mermaid
graph TD
  config["@repo/config"]
  shared["@repo/shared"]
  logger["@repo/logger"]
  cache["@repo/cache"]
  auth["@repo/auth"]
  dbMysql["@repo/db-mysql"]
  dbMongo["@repo/db-mongo"]
  rbac["@repo/rbac"]
  api["@repo/api"]
  admin["@repo/admin"]
  client["@repo/client"]
  widget["@repo/widget"]
  ui["@repo/ui"]

  config --> logger
  config --> cache
  config --> auth
  config --> dbMysql
  config --> dbMongo

  shared --> auth
  shared --> rbac

  cache --> auth
  cache --> rbac

  dbMysql --> rbac

  auth --> api
  cache --> api
  config --> api
  dbMongo --> api
  dbMysql --> api
  logger --> api
  rbac --> api
  shared --> api

  shared --> admin
  ui --> admin

  shared --> client
  ui --> client

  shared --> widget
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Minimum required variables:

```env
# Application
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
CLIENT_URL=http://localhost:3002

# MySQL
DATABASE_URL=mysql://root:password@localhost:3306/saas_db

# MongoDB
MONGODB_URI=mongodb://localhost:27017/saas_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT — must be at least 32 characters
JWT_SECRET=your-super-secret-key-minimum-32-chars
```

### 3. Set up the database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed initial data (default roles, permissions, super admin)
pnpm db:seed
```

### 4. Start development servers

```bash
# Start all apps in parallel
pnpm dev

# Or start individual apps
pnpm dev:api
pnpm dev:admin
pnpm dev:client
```

## Available Scripts

| Script              | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `pnpm dev`          | Start all apps in parallel (hot reload)                 |
| `pnpm dev:api`      | Start API only                                          |
| `pnpm dev:admin`    | Start admin dashboard only                              |
| `pnpm dev:client`   | Start client storefront only                            |
| `pnpm build`        | Build all packages and apps (respects dependency order) |
| `pnpm lint`         | Run ESLint across all packages                          |
| `pnpm test`         | Run Vitest tests across all packages                    |
| `pnpm format`       | Format all files with Prettier                          |
| `pnpm format:check` | Check formatting without writing                        |
| `pnpm clean`        | Remove all `dist/` and `.next/` build artifacts         |
| `pnpm db:generate`  | Regenerate Prisma client from schema                    |
| `pnpm db:migrate`   | Apply pending Prisma migrations                         |
| `pnpm db:seed`      | Seed the database with initial data                     |

## Build Pipeline

Turborepo orchestrates the build in dependency order. The pipeline is:

```
config, shared, ui, logger
  → cache, db-mysql, db-mongo
    → auth
      → rbac
        → api, admin, client, widget
```

All build outputs (`dist/`, `.next/`) are cached by Turborepo. Re-running `pnpm build` after a clean rebuild will replay cached results for unchanged packages.

## Multi-Tenancy

Every tenant is identified by an `x-tenant-id` request header. The API's `tenant` plugin reads this header and attaches `TenantContext` to every request. The Prisma client is extended via `createTenantPrisma(tenantId)` to automatically scope all database queries to the resolved tenant, preventing cross-tenant data access at the ORM level.

## Commit Convention

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add subscription cancellation endpoint
fix: resolve cross-tenant permission leak
chore: update pnpm to 10.26.1
```

This is enforced by Commitlint on every `git commit`.
