import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AuthorizationPipeline } from '@repo/rbac';
import {
  HTTP_STATUS,
  createRoleDto,
  updateRoleDto,
  assignPermissionsDto,
  paginationSchema,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { RolesService } from './roles.service.js';

const isPrismaError = (error: unknown, code: string): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code: unknown }).code === code;

/**
 * Handles HTTP request/response lifecycle for role management endpoints.
 * Validates input, delegates to RolesService, and formats API responses.
 */
export class RolesController {
  private readonly service = new RolesService();

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid query parameters',
        parsed.error.flatten().fieldErrors,
      );
    }

    const result = await this.service.list(req.tenantId, parsed.data);
    return sendSuccess(reply, result.data, HTTP_STATUS.OK, result.meta);
  };

  getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const role = await this.service.getById(req.tenantId, id);

    if (!role) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Role not found');
    }

    return sendSuccess(reply, role);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = createRoleDto.safeParse(req.body);
      if (!parsed.success) {
        return sendError(
          reply,
          HTTP_STATUS.UNPROCESSABLE,
          'VALIDATION_ERROR',
          'Invalid request body',
          parsed.error.flatten().fieldErrors,
        );
      }

      if (parsed.data.permissionIds?.length) {
        const validIds = await this.service.validatePermissionIds(parsed.data.permissionIds);
        if (validIds.length !== parsed.data.permissionIds.length) {
          return sendError(
            reply,
            HTTP_STATUS.BAD_REQUEST,
            'INVALID_PERMISSIONS',
            'One or more permission IDs are invalid',
          );
        }
      }

      const role = await this.service.create(req.tenantId, parsed.data);
      return sendSuccess(reply, role, HTTP_STATUS.CREATED);
    } catch (error) {
      if (isPrismaError(error, 'P2002')) {
        return sendError(
          reply,
          HTTP_STATUS.CONFLICT,
          'CONFLICT',
          'A role with this slug already exists in this tenant',
        );
      }
      throw error;
    }
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };
      const parsed = updateRoleDto.safeParse(req.body);
      if (!parsed.success) {
        return sendError(
          reply,
          HTTP_STATUS.UNPROCESSABLE,
          'VALIDATION_ERROR',
          'Invalid request body',
          parsed.error.flatten().fieldErrors,
        );
      }

      const existing = await this.service.getById(req.tenantId, id);
      if (!existing) {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Role not found');
      }

      const role = await this.service.update(req.tenantId, id, parsed.data);
      return sendSuccess(reply, role);
    } catch (error) {
      if (isPrismaError(error, 'P2002')) {
        return sendError(
          reply,
          HTTP_STATUS.CONFLICT,
          'CONFLICT',
          'A role with this slug already exists in this tenant',
        );
      }
      if (isPrismaError(error, 'P2025')) {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Role not found');
      }
      throw error;
    }
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };

      const existing = await this.service.getById(req.tenantId, id);
      if (!existing) {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Role not found');
      }

      if (existing.isSystem) {
        return sendError(
          reply,
          HTTP_STATUS.FORBIDDEN,
          'FORBIDDEN',
          'System roles cannot be deleted',
        );
      }

      await this.service.delete(req.tenantId, id);
      return sendSuccess(reply, { message: 'Role deleted successfully' });
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Role not found');
      }
      throw error;
    }
  };

  assignPermissions = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id: roleId } = req.params as { id: string };
    const parsed = assignPermissionsDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid request body',
        parsed.error.flatten().fieldErrors,
      );
    }

    const role = await this.service.getById(req.tenantId, roleId);
    if (!role) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Role not found');
    }

    const validIds = await this.service.validatePermissionIds(parsed.data.permissionIds);
    if (validIds.length !== parsed.data.permissionIds.length) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'INVALID_PERMISSIONS',
        'One or more permission IDs are invalid',
      );
    }

    const updated = await this.service.assignPermissions(
      req.tenantId,
      roleId,
      parsed.data.permissionIds,
    );

    const pipeline = (req.server as unknown as Record<string, unknown>)[
      'authPipeline'
    ] as AuthorizationPipeline;
    await pipeline.invalidateRolePermissions(roleId, req.tenantId);

    return sendSuccess(reply, updated);
  };

  removePermission = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id: roleId, permissionId } = req.params as {
      id: string;
      permissionId: string;
    };

    const role = await this.service.getById(req.tenantId, roleId);
    if (!role) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Role not found');
    }

    const hasPermission = role.permissionRoles.some((pr) => pr.permissionId === permissionId);
    if (!hasPermission) {
      return sendError(
        reply,
        HTTP_STATUS.NOT_FOUND,
        'NOT_FOUND',
        'Permission is not assigned to this role',
      );
    }

    const updated = await this.service.removePermission(req.tenantId, roleId, permissionId);

    const pipeline = (req.server as unknown as Record<string, unknown>)[
      'authPipeline'
    ] as AuthorizationPipeline;
    await pipeline.invalidateRolePermissions(roleId, req.tenantId);

    return sendSuccess(reply, updated);
  };
}
