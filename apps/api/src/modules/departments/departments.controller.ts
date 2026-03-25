import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  createDepartmentDto,
  updateDepartmentDto,
  paginationSchema,
  HTTP_STATUS,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { DepartmentsService } from './departments.service.js';

export class DepartmentsController {
  private readonly service = new DepartmentsService();

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const params = paginationSchema.parse(req.query);
    const result = await this.service.list(req.tenantId, params);
    return sendSuccess(reply, result);
  };

  getTree = async (req: FastifyRequest, reply: FastifyReply) => {
    const tree = await this.service.getTree(req.tenantId);
    return sendSuccess(reply, tree);
  };

  getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const department = await this.service.getById(req.tenantId, id);

    if (!department) {
      return sendError(
        reply,
        HTTP_STATUS.NOT_FOUND,
        'DEPARTMENT_NOT_FOUND',
        'Department not found',
      );
    }

    return sendSuccess(reply, department);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createDepartmentDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid department data',
        parsed.error.flatten(),
      );
    }

    const { name, parentId, headUserId } = parsed.data;

    if (parentId) {
      const parentExists = await this.service.exists(req.tenantId, parentId);
      if (!parentExists) {
        return sendError(
          reply,
          HTTP_STATUS.BAD_REQUEST,
          'PARENT_NOT_FOUND',
          'Parent department not found',
        );
      }
    }

    if (headUserId) {
      const userExists = await this.service.userExists(req.tenantId, headUserId);
      if (!userExists) {
        return sendError(
          reply,
          HTTP_STATUS.BAD_REQUEST,
          'USER_NOT_FOUND',
          'Head user not found in this tenant',
        );
      }
    }

    const department = await this.service.create(req.tenantId, { name, parentId, headUserId });
    return sendSuccess(reply, department, HTTP_STATUS.CREATED);
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = updateDepartmentDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid department data',
        parsed.error.flatten(),
      );
    }

    const existing = await this.service.exists(req.tenantId, id);
    if (!existing) {
      return sendError(
        reply,
        HTTP_STATUS.NOT_FOUND,
        'DEPARTMENT_NOT_FOUND',
        'Department not found',
      );
    }

    const { parentId, headUserId, ...rest } = parsed.data;

    if (parentId === id) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'SELF_PARENT',
        'A department cannot be its own parent',
      );
    }

    if (parentId) {
      const parentExists = await this.service.exists(req.tenantId, parentId);
      if (!parentExists) {
        return sendError(
          reply,
          HTTP_STATUS.BAD_REQUEST,
          'PARENT_NOT_FOUND',
          'Parent department not found',
        );
      }
    }

    if (headUserId) {
      const userExists = await this.service.userExists(req.tenantId, headUserId);
      if (!userExists) {
        return sendError(
          reply,
          HTTP_STATUS.BAD_REQUEST,
          'USER_NOT_FOUND',
          'Head user not found in this tenant',
        );
      }
    }

    const department = await this.service.update(req.tenantId, id, {
      ...rest,
      ...(parentId !== undefined && { parentId }),
      ...(headUserId !== undefined && { headUserId }),
    });
    return sendSuccess(reply, department);
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const existing = await this.service.getWithRelations(req.tenantId, id);

    if (!existing) {
      return sendError(
        reply,
        HTTP_STATUS.NOT_FOUND,
        'DEPARTMENT_NOT_FOUND',
        'Department not found',
      );
    }

    if (existing.children.length > 0) {
      return sendError(
        reply,
        HTTP_STATUS.CONFLICT,
        'HAS_CHILDREN',
        'Cannot delete a department with child departments. Reassign or delete them first.',
      );
    }

    if (existing.teams.length > 0) {
      return sendError(
        reply,
        HTTP_STATUS.CONFLICT,
        'HAS_TEAMS',
        'Cannot delete a department with assigned teams. Reassign or delete them first.',
      );
    }

    await this.service.delete(req.tenantId, id);
    return sendSuccess(reply, { id });
  };
}
