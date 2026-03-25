import { Redis } from 'ioredis';
import { pack, unpack } from 'msgpackr';
import { redisConfig } from '@repo/config';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  maxRetries?: number;
}

export class CacheService {
  private client: Redis;
  private prefix: string;
  private connected = false;

  constructor(config?: Partial<CacheConfig>) {
    this.prefix = config?.keyPrefix ?? redisConfig.keyPrefix;
    this.client = new Redis({
      host: config?.host ?? redisConfig.host,
      port: config?.port ?? redisConfig.port,
      password: config?.password ?? redisConfig.password,
      db: config?.db ?? redisConfig.db,
      maxRetriesPerRequest: config?.maxRetries ?? redisConfig.maxRetries,
      retryStrategy: (times) => {
        if (times > (config?.maxRetries ?? redisConfig.maxRetries)) return null;
        return Math.min(times * redisConfig.retryDelayMs, 10000);
      },
      lazyConnect: true,
    });

    this.client.on('error', (err) => {
      if (this.connected) {
        console.error('Redis connection error:', err.message);
      }
    });

    this.client.on('ready', () => {
      this.connected = true;
    });

    this.client.on('close', () => {
      this.connected = false;
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.connected = true;
    } catch {
      this.connected = false;
      console.warn(
        '⚠️  Redis is not available — cache operations will be skipped. ' +
          'Start Redis to enable caching.',
      );
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.quit();
    }
  }

  private key(k: string): string {
    return `${this.prefix}${k}`;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.connected) return null;
    try {
      const raw = await this.client.getBuffer(this.key(key));
      if (!raw) return null;
      return unpack(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.connected) return;
    try {
      const packed = Buffer.from(pack(value));
      if (ttlSeconds) {
        await this.client.set(this.key(key), packed, 'EX', ttlSeconds);
      } else {
        await this.client.set(this.key(key), packed);
      }
    } catch {
      // silently skip cache write
    }
  }

  async del(key: string): Promise<void> {
    if (!this.connected) return;
    try {
      await this.client.del(this.key(key));
    } catch {
      // silently skip
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    if (!this.connected) return;
    try {
      const fullPattern = this.key(pattern);
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.client.scan(cursor, 'MATCH', fullPattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch {
      // silently skip
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.connected) return false;
    try {
      return (await this.client.exists(this.key(key))) === 1;
    } catch {
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.connected) return -1;
    return this.client.ttl(this.key(key));
  }

  async incr(key: string): Promise<number> {
    if (!this.connected) return 0;
    return this.client.incr(this.key(key));
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    if (!this.connected) return;
    try {
      await this.client.expire(this.key(key), ttlSeconds);
    } catch {
      // silently skip
    }
  }

  getClient(): Redis {
    return this.client;
  }
}

let cacheInstance: CacheService | null = null;

export const createCacheService = (config?: Partial<CacheConfig>): CacheService => {
  if (!cacheInstance) {
    cacheInstance = new CacheService(config);
  }
  return cacheInstance;
};
