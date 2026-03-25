import { buildApp } from './app.js';
import { logger } from '@repo/logger';
import { appConfig } from '@repo/config';

const start = async () => {
  const app = await buildApp();

  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  for (const signal of signals) {
    process.on(signal, async () => {
      logger.info(`Received ${signal}, shutting down...`);
      await app.close();
      process.exit(0);
    });
  }

  try {
    await app.listen({ port: appConfig.port, host: '0.0.0.0' });
    logger.info(`Server running on http://localhost:${appConfig.port}`);
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
};

start();
