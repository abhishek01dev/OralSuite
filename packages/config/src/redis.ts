import { z } from 'zod';

const redisSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().int().positive().default(6379),
  password: z.string().optional(),
  db: z.coerce.number().int().min(0).default(0),
  keyPrefix: z.string().default('saas:'),
  maxRetries: z.coerce.number().int().min(0).default(3),
  retryDelayMs: z.coerce.number().int().positive().default(1000),
});

export type RedisConfig = z.infer<typeof redisSchema>;

export const redisConfig: RedisConfig = redisSchema.parse({
  host: process.env['REDIS_HOST'],
  port: process.env['REDIS_PORT'],
  password: process.env['REDIS_PASSWORD'] || undefined,
  db: process.env['REDIS_DB'],
  keyPrefix: process.env['REDIS_KEY_PREFIX'],
  maxRetries: process.env['REDIS_MAX_RETRIES'],
  retryDelayMs: process.env['REDIS_RETRY_DELAY_MS'],
});
