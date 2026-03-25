import { z } from 'zod';

const authSchema = z.object({
  jwtSecret: z.string().min(32),
  jwtAccessExpiry: z.string().default('15m'),
  jwtRefreshExpiry: z.string().default('7d'),
  googleClientId: z.string().optional(),
  googleClientSecret: z.string().optional(),
  githubClientId: z.string().optional(),
  githubClientSecret: z.string().optional(),
  superAdminEmail: z.string().email().default('admin@system.com'),
  superAdminPassword: z.string().min(8).default('changeme123'),
});

export type AuthConfig = z.infer<typeof authSchema>;

export const authConfig: AuthConfig = authSchema.parse({
  jwtSecret: process.env['JWT_SECRET'] ?? 'default-dev-secret-change-in-production-min-32',
  jwtAccessExpiry: process.env['JWT_ACCESS_EXPIRY'],
  jwtRefreshExpiry: process.env['JWT_REFRESH_EXPIRY'],
  googleClientId: process.env['GOOGLE_CLIENT_ID'] || undefined,
  googleClientSecret: process.env['GOOGLE_CLIENT_SECRET'] || undefined,
  githubClientId: process.env['GITHUB_CLIENT_ID'] || undefined,
  githubClientSecret: process.env['GITHUB_CLIENT_SECRET'] || undefined,
  superAdminEmail: process.env['SUPER_ADMIN_EMAIL'],
  superAdminPassword: process.env['SUPER_ADMIN_PASSWORD'],
});
