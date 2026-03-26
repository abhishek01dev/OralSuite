import type { FastifyRequest, FastifyReply } from 'fastify';
import type { TokenService, JwtPayload } from '@repo/auth';
import {
  loginDto,
  createUserDto,
  forgotPasswordDto,
  resetPasswordDto,
  HTTP_STATUS,
  CACHE_TTL,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { AuthService } from './auth.service.js';

interface RefreshBody {
  refreshToken: string;
}

export class AuthController {
  private service = new AuthService();

  register = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createUserDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid registration data',
        parsed.error.flatten(),
      );
    }

    const { email, password, firstName, lastName, practiceName } = parsed.data;
    const tenantId = req.tenantId;

    const existing = await this.service.checkEmailExists(tenantId, email);
    if (existing) {
      return sendError(
        reply,
        HTTP_STATUS.CONFLICT,
        'EMAIL_TAKEN',
        'A user with this email already exists',
      );
    }

    const user = await this.service.registerUser(tenantId, {
      email,
      password,
      firstName,
      lastName,
      practiceName,
    });

    const tokenService = (req.server as unknown as Record<string, unknown>)[
      'tokenService'
    ] as TokenService;
    const tokens = tokenService.generateTokenPair(user.id, user.tenantId, user.email);
    await tokenService.storeRefreshToken(
      this.extractJti(tokens.refreshToken),
      user.id,
      user.tenantId,
    );

    return sendSuccess(reply, { user, tokens }, HTTP_STATUS.CREATED);
  };

  login = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = loginDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid login data',
        parsed.error.flatten(),
      );
    }

    const { email, password } = parsed.data;
    const tenantId = req.tenantId;

    const user = await this.service.findUserByEmail(tenantId, email);
    if (!user) {
      return sendError(
        reply,
        HTTP_STATUS.UNAUTHORIZED,
        'INVALID_CREDENTIALS',
        'Invalid email or password',
      );
    }
    if (user.status !== 'active') {
      return sendError(reply, HTTP_STATUS.FORBIDDEN, 'ACCOUNT_INACTIVE', 'Account is not active');
    }

    const valid = await this.service.verifyPassword(user.passwordHash, password);
    if (!valid) {
      return sendError(
        reply,
        HTTP_STATUS.UNAUTHORIZED,
        'INVALID_CREDENTIALS',
        'Invalid email or password',
      );
    }

    await this.service.updateLastLogin(tenantId, user.id);

    const tokenService = (req.server as unknown as Record<string, unknown>)[
      'tokenService'
    ] as TokenService;
    const tokens = tokenService.generateTokenPair(user.id, user.tenantId, user.email);
    await tokenService.storeRefreshToken(
      this.extractJti(tokens.refreshToken),
      user.id,
      user.tenantId,
    );

    const roles = user.roleUsers.map((ru) => ru.role.name);
    return sendSuccess(reply, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        roles,
      },
      tokens,
    });
  };

  refresh = async (req: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = (req.body as RefreshBody | null) ?? {};

    if (!refreshToken) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'MISSING_TOKEN',
        'Refresh token is required',
      );
    }

    const tokenService = (req.server as unknown as Record<string, unknown>)[
      'tokenService'
    ] as TokenService;

    let payload: JwtPayload;
    try {
      payload = tokenService.verifyToken(refreshToken);
    } catch {
      return sendError(
        reply,
        HTTP_STATUS.UNAUTHORIZED,
        'INVALID_TOKEN',
        'Invalid or expired refresh token',
      );
    }

    if (payload.type !== 'refresh') {
      return sendError(
        reply,
        HTTP_STATUS.UNAUTHORIZED,
        'INVALID_TOKEN_TYPE',
        'Expected refresh token',
      );
    }

    const isBlacklisted = await tokenService.isTokenBlacklisted(payload.jti);
    if (isBlacklisted) {
      return sendError(
        reply,
        HTTP_STATUS.UNAUTHORIZED,
        'TOKEN_REVOKED',
        'Refresh token has been revoked',
      );
    }

    await tokenService.revokeRefreshToken(payload.jti);

    const tokens = tokenService.generateTokenPair(payload.sub, payload.tenantId, payload.email);

    await tokenService.storeRefreshToken(
      this.extractJti(tokens.refreshToken),
      payload.sub,
      payload.tenantId,
    );

    return sendSuccess(reply, { tokens });
  };

  logout = async (req: FastifyRequest, reply: FastifyReply) => {
    const tokenService = (req.server as unknown as Record<string, unknown>)[
      'tokenService'
    ] as TokenService;
    const jwtPayload = req.jwtPayload;

    if (!jwtPayload) {
      return sendError(reply, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED', 'Not authenticated');
    }

    await tokenService.blacklistToken(jwtPayload.jti, CACHE_TTL.REFRESH_TOKEN);

    const refreshToken = (req.body as Record<string, unknown> | null)?.['refreshToken'] as
      | string
      | undefined;
    if (refreshToken) {
      try {
        const refreshPayload = tokenService.verifyToken(refreshToken);
        await tokenService.revokeRefreshToken(refreshPayload.jti);
      } catch {
        // Refresh token already expired or invalid — ignore
      }
    }

    return sendSuccess(reply, { message: 'Logged out successfully' });
  };

  me = async (req: FastifyRequest, reply: FastifyReply) => {
    const user = await this.service.findUserWithPermissions(req.tenantId, req.userId);
    if (!user) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND', 'User not found');
    }

    const roles = user.roleUsers.map((ru) => ({
      id: ru.role.id,
      name: ru.role.name,
      slug: ru.role.slug,
      permissions: ru.role.permissionRoles.map((pr) => pr.permission.name),
    }));

    const { roleUsers: _roleUsers, ...userData } = user;
    return sendSuccess(reply, { ...userData, roles });
  };

  forgotPassword = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = forgotPasswordDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid data',
        parsed.error.flatten(),
      );
    }

    const { email } = parsed.data;
    const token = await this.service.createPasswordResetToken(req.tenantId, email);

    // In a real app, send an email. For now, just return success.
    // In dev, maybe log the token to console.
    if (token) {
      console.warn(`[AUTH] Password reset token for ${email}: ${token}`);
    }

    return sendSuccess(reply, { message: 'If an account exists, a reset link has been sent.' });
  };

  resetPassword = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = resetPasswordDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid data',
        parsed.error.flatten(),
      );
    }

    const { token, password } = parsed.data;
    const result = await this.service.resetPassword(req.tenantId, token, password);

    if (!result.success) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'RESET_FAILED',
        result.message || 'Failed to reset password',
      );
    }

    return sendSuccess(reply, { message: 'Password reset successfully' });
  };

  private extractJti(token: string): string {
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1]!, 'base64url').toString()) as { jti: string };
    return payload.jti;
  }
}
