# @repo/db-mongo

MongoDB document database layer using [Mongoose](https://mongoosejs.com/). Stores high-volume, append-heavy data that is not suited for relational storage — audit logs, activity logs, notifications, and cart sessions.

## Exports

```typescript
import {
  connectMongo,
  disconnectMongo,
  AuditLog,
  ActivityLog,
  Notification,
  CartSession,
} from '@repo/db-mongo';
import type { IAuditLog } from '@repo/db-mongo';
```

| Export              | Type                        | Description                                       |
| ------------------- | --------------------------- | ------------------------------------------------- |
| `connectMongo()`    | `async function`            | Connect to MongoDB and configure connection pool  |
| `disconnectMongo()` | `async function`            | Gracefully close the Mongoose connection          |
| `AuditLog`          | Mongoose `Model<IAuditLog>` | Immutable audit trail of all write operations     |
| `IAuditLog`         | TypeScript interface        | Document shape for `AuditLog`                     |
| `ActivityLog`       | Mongoose `Model`            | User activity tracking (page views, clicks, etc.) |
| `Notification`      | Mongoose `Model`            | User-targeted notifications                       |
| `CartSession`       | Mongoose `Model`            | Persistent shopping cart sessions                 |

## Connection

```typescript
import { connectMongo, disconnectMongo } from '@repo/db-mongo';

// On application startup
await connectMongo();

// On graceful shutdown
await disconnectMongo();
```

### Connection Pool Configuration

| Setting                  | Value    |
| ------------------------ | -------- |
| Min pool size            | 5        |
| Max pool size            | 50       |
| Server selection timeout | 5 000 ms |

## Models

### `AuditLog` — Immutable Audit Trail

Stores an immutable record of every write operation (create, update, delete) and security event (login, logout) in the platform.

#### Schema

| Field       | Type             | Description                                                                 |
| ----------- | ---------------- | --------------------------------------------------------------------------- |
| `userId`    | `string`         | ID of the user who performed the action                                     |
| `tenantId`  | `string`         | Tenant the action occurred in                                               |
| `action`    | `string`         | One of: `create`, `update`, `delete`, `login`, `logout`, `access`, `export` |
| `modelType` | `string`         | The entity type affected (e.g., `"User"`, `"Role"`)                         |
| `modelId`   | `string`         | ID of the affected entity                                                   |
| `oldValues` | `object \| null` | State of the entity before the change                                       |
| `newValues` | `object \| null` | State of the entity after the change                                        |
| `ipAddress` | `string`         | Client IP address                                                           |
| `userAgent` | `string`         | Client User-Agent header                                                    |
| `metadata`  | `object`         | Additional context (e.g., request ID, route)                                |
| `timestamp` | `Date`           | Event timestamp (default: `Date.now`)                                       |

#### Indexes

| Index                                       | Purpose                                      |
| ------------------------------------------- | -------------------------------------------- |
| `{ tenantId: 1, timestamp: -1 }`            | Paginated log listing per tenant             |
| `{ tenantId: 1, modelType: 1, modelId: 1 }` | Fetch history for a specific entity          |
| `{ tenantId: 1, userId: 1, timestamp: -1 }` | Fetch history for a specific user            |
| `{ timestamp: 1 }` (TTL)                    | **Auto-delete documents older than 90 days** |

#### Usage

```typescript
import { AuditLog } from '@repo/db-mongo';

// Query audit logs for a tenant (paginated)
const logs = await AuditLog.find({ tenantId: 'tenant-acme' }).sort({ timestamp: -1 }).limit(20);

// Query changes to a specific entity
const history = await AuditLog.find({
  tenantId: 'tenant-acme',
  modelType: 'User',
  modelId: 'user-123',
});
```

---

### `ActivityLog`

Tracks user activity events (page views, feature usage, etc.) for analytics. Fields include `userId`, `tenantId`, `action`, `resource`, `metadata`, and `timestamp`.

---

### `Notification`

Stores user-targeted notifications. Fields include `userId`, `tenantId`, `type`, `title`, `body`, `isRead`, `readAt`, and `createdAt`.

---

### `CartSession`

Persists shopping cart sessions for the `@repo/client` storefront. Fields include `sessionId`, `tenantId`, `userId` (optional for guest carts), `items` (array of `{ productId, quantity, price }`), and `updatedAt`.

## Environment Variables

| Variable      | Description                                                        |
| ------------- | ------------------------------------------------------------------ |
| `MONGODB_URI` | MongoDB connection URI (e.g., `mongodb://localhost:27017/saas_db`) |

## Workspace Dependencies

| Package        | Purpose                     |
| -------------- | --------------------------- |
| `@repo/config` | `databaseConfig.mongodbUri` |
