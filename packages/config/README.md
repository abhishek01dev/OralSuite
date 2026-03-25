# @repo/config

Centralised, Zod-validated environment configuration for the entire monorepo. All config objects are parsed and validated at import time — any missing or invalid environment variable throws an error immediately on startup.

## How It Works

- Loads `.env` from the monorepo root via `dotenv`
- Each config module defines a Zod schema with types, defaults, and coercions
- Parsed config objects are exported as singletons — no repeated `process.env` reads

```typescript
import { appConfig, databaseConfig, redisConfig, authConfig, loggerConfig } from '@repo/config';
```

## Exports

### `appConfig` — Application Config

```typescript
import { appConfig } from '@repo/config';
```

| Field             | Env Var             | Default                 | Description                                              |
| ----------------- | ------------------- | ----------------------- | -------------------------------------------------------- |
| `nodeEnv`         | `NODE_ENV`          | `development`           | `development`, `production`, or `test`                   |
| `port`            | `PORT`              | `3000`                  | HTTP server port                                         |
| `apiUrl`          | `API_URL`           | `http://localhost:3000` | Public API base URL                                      |
| `adminUrl`        | `ADMIN_URL`         | `http://localhost:3001` | Admin dashboard URL                                      |
| `clientUrl`       | `CLIENT_URL`        | `http://localhost:3002` | Client storefront URL                                    |
| `corsOrigins`     | `CORS_ORIGINS`      | `[adminUrl, clientUrl]` | Comma-separated allowed CORS origins (parsed into array) |
| `rateLimitGlobal` | `RATE_LIMIT_GLOBAL` | `1000`                  | Global rate limit (requests per minute)                  |
| `rateLimitAuth`   | `RATE_LIMIT_AUTH`   | `10`                    | Auth endpoint rate limit (requests per minute)           |

---

### `databaseConfig` — Database Config

```typescript
import { databaseConfig } from '@repo/config';
```

| Field           | Env Var          | Default                                        | Description             |
| --------------- | ---------------- | ---------------------------------------------- | ----------------------- |
| `mysqlHost`     | `MYSQL_HOST`     | `localhost`                                    | MySQL hostname          |
| `mysqlPort`     | `MYSQL_PORT`     | `3306`                                         | MySQL port              |
| `mysqlDatabase` | `MYSQL_DATABASE` | `saas_db`                                      | MySQL database name     |
| `mysqlUser`     | `MYSQL_USER`     | `root`                                         | MySQL user              |
| `mysqlPassword` | `MYSQL_PASSWORD` | `password`                                     | MySQL password          |
| `databaseUrl`   | `DATABASE_URL`   | `mysql://root:password@localhost:3306/saas_db` | Prisma connection URL   |
| `mongodbUri`    | `MONGODB_URI`    | `mongodb://localhost:27017/saas_db`            | Mongoose connection URI |

---

### `redisConfig` — Redis Config

```typescript
import { redisConfig } from '@repo/config';
```

| Field          | Env Var                | Default     | Description                      |
| -------------- | ---------------------- | ----------- | -------------------------------- |
| `host`         | `REDIS_HOST`           | `localhost` | Redis hostname                   |
| `port`         | `REDIS_PORT`           | `6379`      | Redis port                       |
| `password`     | `REDIS_PASSWORD`       | —           | Redis password (optional)        |
| `db`           | `REDIS_DB`             | `0`         | Redis database index             |
| `keyPrefix`    | `REDIS_KEY_PREFIX`     | `saas:`     | Prefix applied to all cache keys |
| `maxRetries`   | `REDIS_MAX_RETRIES`    | `3`         | Max reconnect attempts           |
| `retryDelayMs` | `REDIS_RETRY_DELAY_MS` | `1000`      | Base delay between retries (ms)  |

---

### `authConfig` — Auth Config

```typescript
import { authConfig } from '@repo/config';
```

| Field                | Env Var                | Default                  | Description                                   |
| -------------------- | ---------------------- | ------------------------ | --------------------------------------------- |
| `jwtSecret`          | `JWT_SECRET`           | `default-dev-secret-...` | **Required in production.** Min 32 characters |
| `jwtAccessExpiry`    | `JWT_ACCESS_EXPIRY`    | `15m`                    | Access token expiry (e.g. `15m`, `1h`)        |
| `jwtRefreshExpiry`   | `JWT_REFRESH_EXPIRY`   | `7d`                     | Refresh token expiry (e.g. `7d`, `30d`)       |
| `googleClientId`     | `GOOGLE_CLIENT_ID`     | —                        | OAuth Google client ID (optional)             |
| `googleClientSecret` | `GOOGLE_CLIENT_SECRET` | —                        | OAuth Google client secret (optional)         |
| `githubClientId`     | `GITHUB_CLIENT_ID`     | —                        | OAuth GitHub client ID (optional)             |
| `githubClientSecret` | `GITHUB_CLIENT_SECRET` | —                        | OAuth GitHub client secret (optional)         |
| `superAdminEmail`    | `SUPER_ADMIN_EMAIL`    | `admin@system.com`       | Seeded super admin email                      |
| `superAdminPassword` | `SUPER_ADMIN_PASSWORD` | `changeme123`            | Seeded super admin password                   |

---

### `loggerConfig` — Logger Config

```typescript
import { loggerConfig } from '@repo/config';
```

| Field      | Env Var     | Default       | Description                    |
| ---------- | ----------- | ------------- | ------------------------------ |
| `logLevel` | `LOG_LEVEL` | `info`        | Pino log level                 |
| `nodeEnv`  | `NODE_ENV`  | `development` | Used to toggle pretty-printing |

---

## Type Exports

Each config module also exports its TypeScript interface:

```typescript
import type {
  AppConfig,
  DatabaseConfig,
  RedisConfig,
  AuthConfig,
  LoggerConfig,
} from '@repo/config';
```

## Example `.env`

```env
NODE_ENV=production
PORT=3000
API_URL=https://api.myapp.com
ADMIN_URL=https://admin.myapp.com
CLIENT_URL=https://app.myapp.com

DATABASE_URL=mysql://user:pass@db.host:3306/saas_db
MONGODB_URI=mongodb://mongo.host:27017/saas_db

REDIS_HOST=redis.host
REDIS_PORT=6379
REDIS_PASSWORD=secret
REDIS_KEY_PREFIX=saas:prod:

JWT_SECRET=a-very-long-random-secret-string-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

SUPER_ADMIN_EMAIL=admin@myapp.com
SUPER_ADMIN_PASSWORD=a-secure-password
```
