import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  createUserDto,
  updateUserDto,
  paginationSchema,
  userPermissionOverrideDto,
  HTTP_STATUS,
  PAGINATION,
} from '@repo/shared';
import type { CacheService } from '@repo/cache';
import { sendSuccess, sendError } from '@utils/response.js';
import { UsersService } from './users.service.js';

interface IdParam {
  id: string;
}

interface RoleParam extends IdParam {
  roleId: string;
}

interface AssignRolesBody {
  roleIds: string[];
}

interface ListQuery {
  cursor?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  search?: string;
}

export class UsersController {
  private service = new UsersService();

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const rawQuery = req.query as ListQuery;
    const parsed = paginationSchema.safeParse(rawQuery);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid pagination parameters',
        parsed.error.flatten(),
      );
    }

    const { status, search } = rawQuery;
    const params = {
      ...parsed.data,
      limit: Math.min(parsed.data.limit, PAGINATION.MAX_LIMIT),
    };

    const result = await this.service.list(req.tenantId, params, { status, search });

    return sendSuccess(reply, result);
  };

  getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const user = await this.service.getById(req.tenantId, id);

    if (!user) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND', 'User not found');
    }

    return sendSuccess(reply, user);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createUserDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid user data',
        parsed.error.flatten(),
      );
    }

    const existing = await this.service.findByEmail(req.tenantId, parsed.data.email);
    if (existing) {
      return sendError(
        reply,
        HTTP_STATUS.CONFLICT,
        'EMAIL_TAKEN',
        'A user with this email already exists',
      );
    }

    const user = await this.service.create(req.tenantId, parsed.data);

    return sendSuccess(reply, user, HTTP_STATUS.CREATED);
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const parsed = updateUserDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid user data',
        parsed.error.flatten(),
      );
    }

    const existing = await this.service.getById(req.tenantId, id);
    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND', 'User not found');
    }

    const user = await this.service.update(req.tenantId, id, parsed.data);

    return sendSuccess(reply, user);
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const existing = await this.service.getById(req.tenantId, id);
    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND', 'User not found');
    }

    const result = await this.service.softDelete(req.tenantId, id);

    return sendSuccess(reply, result);
  };

  assignRoles = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const { roleIds } = (req.body as AssignRolesBody | null) ?? {};

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'VALIDATION_ERROR',
        'roleIds must be a non-empty array',
      );
    }

    const existing = await this.service.getById(req.tenantId, id);
    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND', 'User not found');
    }

    const cache = (req.server as unknown as Record<string, unknown>)['cache'] as
      | CacheService
      | undefined;
    const user = await this.service.assignRoles(req.tenantId, id, roleIds, req.userId, cache);

    return sendSuccess(reply, user);
  };

  removeRole = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, roleId } = req.params as RoleParam;

    const existing = await this.service.getById(req.tenantId, id);
    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND', 'User not found');
    }

    const cache = (req.server as unknown as Record<string, unknown>)['cache'] as
      | CacheService
      | undefined;
    const user = await this.service.removeRole(req.tenantId, id, roleId, cache);

    return sendSuccess(reply, user);
  };

  overridePermission = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const parsed = userPermissionOverrideDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid permission override data',
        parsed.error.flatten(),
      );
    }

    const existing = await this.service.getById(req.tenantId, id);
    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND', 'User not found');
    }

    const cache = (req.server as unknown as Record<string, unknown>)['cache'] as
      | CacheService
      | undefined;
    const override = await this.service.overridePermission(req.tenantId, id, parsed.data, cache);

    if (!override) {
      return sendError(
        reply,
        HTTP_STATUS.NOT_FOUND,
        'PERMISSION_NOT_FOUND',
        'Permission not found',
      );
    }

    return sendSuccess(reply, override);
  };
}
