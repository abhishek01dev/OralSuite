export interface JwtPayload {
  sub: string;
  tenantId: string;
  email: string;
  jti: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
