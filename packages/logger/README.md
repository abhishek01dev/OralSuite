# @repo/logger

A shared [Pino](https://getpino.io/) logger instance used across all backend packages and the API. Provides environment-aware output — pretty-printed and colorized in development, structured JSON in production. Automatically redacts sensitive headers.

## Exports

```typescript
import { logger, createChildLogger } from '@repo/logger';
import type { Logger } from '@repo/logger';
```

| Export              | Type                                                | Description                                          |
| ------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `logger`            | `pino.Logger`                                       | Singleton Pino logger instance                       |
| `createChildLogger` | `(context: Record<string, unknown>) => pino.Logger` | Creates a child logger with additional bound context |
| `Logger`            | type                                                | Re-export of Pino's `Logger` type                    |

## Behavior

| Environment   | Output format                           | Log level |
| ------------- | --------------------------------------- | --------- |
| `development` | Pretty-printed, colorized (pino-pretty) | `debug`   |
| `production`  | Structured JSON                         | `info`    |
| `test`        | Structured JSON                         | `warn`    |

The log level defaults to `info` and can be overridden by the `LOG_LEVEL` environment variable.

## Redacted Fields

The following fields are automatically redacted from all log output to prevent credential leaks:

- `req.headers.authorization`
- `req.headers.cookie`

## Usage

### Basic logging

```typescript
import { logger } from '@repo/logger';

logger.info('Server started');
logger.debug({ userId: '123', tenantId: 'acme' }, 'User looked up');
logger.warn({ latencyMs: 2500 }, 'Slow database query');
logger.error({ err }, 'Unhandled error');
```

### Child logger with bound context

Use child loggers to attach a consistent context to all log lines within a module or request:

```typescript
import { createChildLogger } from '@repo/logger';

const log = createChildLogger({ module: 'auth-service', tenantId: 'acme' });

log.info('Login attempt');
// Outputs: { module: 'auth-service', tenantId: 'acme', msg: 'Login attempt', ... }
```

### Using with Fastify

The API passes the logger instance directly to Fastify:

```typescript
import { logger } from '@repo/logger';
import Fastify from 'fastify';

const app = Fastify({ loggerInstance: logger });
```

## Workspace Dependencies

| Package        | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `@repo/config` | Reads `loggerConfig.logLevel` and `loggerConfig.nodeEnv` |
