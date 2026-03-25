import { z } from 'zod';

const loggerSchema = z.object({
  level: z.string().default('debug'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
});

export type LoggerConfig = z.infer<typeof loggerSchema>;

export const loggerConfig: LoggerConfig = loggerSchema.parse({
  level: process.env['LOG_LEVEL'],
  nodeEnv: process.env['NODE_ENV'],
});
