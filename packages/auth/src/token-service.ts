import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { authConfig } from '@repo/config';
import type { CacheService } from '@repo/cache';
import type { JwtPayload, TokenPair } from './types.js';

export class TokenService {
  private cache: CacheService;

  constructor(cache: CacheService) {
    this.cache = cache;
  }

  generateTokenPair(userId: string, tenantId: string, email: string): TokenPair {
    const jti = randomUUID();
    const refreshJti = randomUUID();

    const accessToken = jwt.sign(
      { sub: userId, tenantId, email, jti, type: 'access' } satisfies JwtPayload,
      authConfig.jwtSecret,
      { expiresIn: this.parseExpiry(authConfig.jwtAccessExpiry) },
    );

    const refreshToken = jwt.sign(
      { sub: userId, tenantId, email, jti: refreshJti, type: 'refresh' } satisfies JwtPayload,
      authConfig.jwtSecret,
      { expiresIn: this.parseExpiry(authConfig.jwtRefreshExpiry) },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiry(authConfig.jwtAccessExpiry),
    };
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
  }

  async blacklistToken(jti: string, expiresInSeconds: number): Promise<void> {
    await this.cache.set(`blacklist:${jti}`, true, expiresInSeconds);
  }

  async isTokenBlacklisted(jti: string): Promise<boolean> {
    return this.cache.exists(`blacklist:${jti}`);
  }

  async storeRefreshToken(jti: string, userId: string, tenantId: string): Promise<void> {
    const ttl = this.parseExpiry(authConfig.jwtRefreshExpiry);
    await this.cache.set(`session:${jti}`, { userId, tenantId }, ttl);
  }

  async revokeRefreshToken(jti: string): Promise<void> {
    await this.cache.del(`session:${jti}`);
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900;
    const value = parseInt(match[1]!, 10);
    const unit = match[2]!;
    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };
    return value * (multipliers[unit] ?? 60);
  }
}
