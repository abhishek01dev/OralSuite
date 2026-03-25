import pino from 'pino';
import { loggerConfig } from '@repo/config';

const isProduction = loggerConfig.nodeEnv === 'production';

export const logger = pino({
  level: loggerConfig.level ?? (isProduction ? 'info' : 'debug'),
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  redact: ['req.headers.authorization', 'req.headers.cookie'],
});

export const createChildLogger = (context: Record<string, unknown>) => logger.child(context);

export type { Logger } from 'pino';
