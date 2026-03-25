import { z } from 'zod';

const databaseSchema = z.object({
  mysqlHost: z.string().default('localhost'),
  mysqlPort: z.coerce.number().int().positive().default(3306),
  mysqlDatabase: z.string().default('saas_db'),
  mysqlUser: z.string().default('root'),
  mysqlPassword: z.string().default('password'),
  databaseUrl: z.string().default('mysql://root:password@localhost:3306/saas_db'),
  mongodbUri: z.string().default('mongodb://localhost:27017/saas_db'),
});

export type DatabaseConfig = z.infer<typeof databaseSchema>;

export const databaseConfig: DatabaseConfig = databaseSchema.parse({
  mysqlHost: process.env['MYSQL_HOST'],
  mysqlPort: process.env['MYSQL_PORT'],
  mysqlDatabase: process.env['MYSQL_DATABASE'],
  mysqlUser: process.env['MYSQL_USER'],
  mysqlPassword: process.env['MYSQL_PASSWORD'],
  databaseUrl: process.env['DATABASE_URL'],
  mongodbUri: process.env['MONGODB_URI'],
});
