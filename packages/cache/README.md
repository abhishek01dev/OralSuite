# @repo/cache

A Redis-backed cache service with [msgpack](https://msgpack.org/) binary serialization. All values are packed with `msgpackr` before writing to Redis, giving significantly smaller payloads and faster (de)serialization compared to JSON — especially for deeply nested objects.

## Exports

```typescript
import { CacheService, createCacheService } from '@repo/cache';
import type { CacheConfig } from '@repo/cache';
```

| Export                        | Description                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| `CacheService`                | Class — the full cache client                                   |
| `createCacheService(config?)` | Singleton factory — returns the same instance on repeated calls |
| `CacheConfig`                 | TypeScript interface for the constructor config                 |

## `createCacheService(config?)`

Returns a module-level singleton `CacheService`. Calling it multiple times returns the same instance. Uses `@repo/config`'s `redisConfig` as the default config.

```typescript
import { createCacheService } from '@repo/cache';

const cache = createCacheService(); // uses redisConfig defaults
await cache.connect();
```

## `CacheService` API

### Connection

```typescript
await cache.connect(); // connect to Redis (lazy — must be called before first use)
await cache.disconnect(); // graceful quit
```

### Read / Write

```typescript
// Get a value. Returns null if not found.
const user = await cache.get<User>('user:123');

// Set a value with optional TTL in seconds
await cache.set('user:123', userObject, 300); // expires in 5 minutes
await cache.set('config:123', config); // no expiry

// Delete a single key
await cache.del('user:123');

// Delete all keys matching a glob pattern (uses SCAN — safe for large key sets)
await cache.delByPattern('user:tenant-acme:*');

// Check if a key exists
const exists = await cache.exists('blacklist:abc-jti');

// Get remaining TTL in seconds (-1 = no expiry, -2 = not found)
const ttl = await cache.ttl('session:xyz');

// Atomic increment
const count = await cache.incr('ratelimit:acme:192.168.1.1');

// Set/update TTL on an existing key
await cache.expire('session:xyz', 3600);
```

### Raw Client

```typescript
// Access the underlying ioredis client for operations not covered above
const redis = cache.getClient();
await redis.hset('hash:key', 'field', 'value');
```

## `delByPattern` — SCAN Loop

`delByPattern` uses a cursor-based `SCAN` loop instead of `KEYS` to safely iterate over large key sets without blocking the Redis server:

```typescript
// Invalidate all permission cache entries for a tenant
await cache.delByPattern('perm:user:tenant-acme:*');
```

Each iteration scans up to 100 keys. The key prefix configured on the `CacheService` instance is automatically prepended to the pattern.

## Key Namespacing

All keys are namespaced with the `keyPrefix` (default: `saas:`). This keeps all application keys isolated from other data in the same Redis instance.

```typescript
cache.set('user:123', data);
// Stored in Redis as: "saas:user:123"
```

## `CacheConfig` Interface

```typescript
interface CacheConfig {
  host: string; // default: redisConfig.host
  port: number; // default: redisConfig.port
  password?: string; // default: redisConfig.password
  db?: number; // default: redisConfig.db
  keyPrefix?: string; // default: redisConfig.keyPrefix ("saas:")
  maxRetries?: number; // default: redisConfig.maxRetries (3)
}
```

## Workspace Dependencies

| Package        | Purpose                |
| -------------- | ---------------------- |
| `@repo/config` | `redisConfig` defaults |
