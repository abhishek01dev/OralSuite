import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const appSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().int().positive().default(3000),
  apiUrl: z.string().url().default('http://localhost:3000'),
  adminUrl: z.string().url().default('http://localhost:3001'),
  clientUrl: z.string().url().default('http://localhost:3002'),
  corsOrigins: z
    .string()
    .transform((val) => val.split(','))
    .default(['http://localhost:3001', 'http://localhost:3002']),
  rateLimitGlobal: z.coerce.number().int().positive().default(1000),
  rateLimitAuth: z.coerce.number().int().positive().default(10),
});

export type AppConfig = z.infer<typeof appSchema>;

export const appConfig: AppConfig = appSchema.parse({
  nodeEnv: process.env['NODE_ENV'],
  port: process.env['PORT'],
  apiUrl: process.env['API_URL'],
  adminUrl: process.env['ADMIN_URL'],
  clientUrl: process.env['CLIENT_URL'],
  corsOrigins:
    process.env['CORS_ORIGINS'] ??
    `${process.env['ADMIN_URL'] ?? 'http://localhost:3001'},${process.env['CLIENT_URL'] ?? 'http://localhost:3002'}`,
  rateLimitGlobal: process.env['RATE_LIMIT_GLOBAL'],
  rateLimitAuth: process.env['RATE_LIMIT_AUTH'],
});
