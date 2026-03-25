import type { FastifyRequest, FastifyReply } from 'fastify';
import { createTeamDto, updateTeamDto, paginationSchema, HTTP_STATUS } from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { TeamsService } from './teams.service.js';
import { z } from 'zod';

const addMemberDto = z.object({
  userId: z.string().min(1),
});

interface IdParam {
  id: string;
}

interface MemberParam {
  id: string;
  userId: string;
}

export class TeamsController {
  private readonly service = new TeamsService();

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const params = paginationSchema.parse(req.query);
    const query = req.query as Record<string, string>;
    const filters = { departmentId: query['departmentId'] };
    const result = await this.service.list(req.tenantId, params, filters);
    return sendSuccess(reply, result);
  };

  getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const team = await this.service.getById(req.tenantId, id);

    if (!team) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'TEAM_NOT_FOUND', 'Team not found');
    }

    return sendSuccess(reply, team);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createTeamDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid team data',
        parsed.error.flatten(),
      );
    }

    const { name, departmentId, leadUserId } = parsed.data;

    const departmentExists = await this.service.departmentExists(req.tenantId, departmentId);
    if (!departmentExists) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'DEPARTMENT_NOT_FOUND',
        'Department not found',
      );
    }

    if (leadUserId) {
      const userExists = await this.service.userExists(req.tenantId, leadUserId);
      if (!userExists) {
        return sendError(
          reply,
          HTTP_STATUS.BAD_REQUEST,
          'USER_NOT_FOUND',
          'Lead user not found in this tenant',
        );
      }
    }

    const team = await this.service.create(req.tenantId, { name, departmentId, leadUserId });
    return sendSuccess(reply, team, HTTP_STATUS.CREATED);
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const parsed = updateTeamDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid team data',
        parsed.error.flatten(),
      );
    }

    const existing = await this.service.exists(req.tenantId, id);
    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'TEAM_NOT_FOUND', 'Team not found');
    }

    const { departmentId, leadUserId, ...rest } = parsed.data;

    if (departmentId) {
      const departmentExists = await this.service.departmentExists(req.tenantId, departmentId);
      if (!departmentExists) {
        return sendError(
          reply,
          HTTP_STATUS.BAD_REQUEST,
          'DEPARTMENT_NOT_FOUND',
          'Department not found',
        );
      }
    }

    if (leadUserId) {
      const userExists = await this.service.userExists(req.tenantId, leadUserId);
      if (!userExists) {
        return sendError(
          reply,
          HTTP_STATUS.BAD_REQUEST,
          'USER_NOT_FOUND',
          'Lead user not found in this tenant',
        );
      }
    }

    const team = await this.service.update(req.tenantId, id, {
      ...rest,
      ...(departmentId !== undefined && { departmentId }),
      ...(leadUserId !== undefined && { leadUserId }),
    });
    return sendSuccess(reply, team);
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const existing = await this.service.getWithMemberCount(req.tenantId, id);

    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'TEAM_NOT_FOUND', 'Team not found');
    }

    if (existing._count.teamUsers > 0) {
      return sendError(
        reply,
        HTTP_STATUS.CONFLICT,
        'HAS_MEMBERS',
        'Cannot delete a team with active members. Remove them first.',
      );
    }

    await this.service.delete(req.tenantId, id);
    return sendSuccess(reply, { id });
  };

  addMember = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const parsed = addMemberDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'userId is required',
        parsed.error.flatten(),
      );
    }

    const { userId } = parsed.data;

    const teamExists = await this.service.exists(req.tenantId, id);
    if (!teamExists) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'TEAM_NOT_FOUND', 'Team not found');
    }

    const userExists = await this.service.userExists(req.tenantId, userId);
    if (!userExists) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'USER_NOT_FOUND',
        'User not found in this tenant',
      );
    }

    const alreadyMember = await this.service.findMembership(req.tenantId, id, userId);
    if (alreadyMember) {
      return sendError(
        reply,
        HTTP_STATUS.CONFLICT,
        'ALREADY_MEMBER',
        'User is already a member of this team',
      );
    }

    const membership = await this.service.addMember(req.tenantId, id, userId);
    return sendSuccess(reply, membership, HTTP_STATUS.CREATED);
  };

  removeMember = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, userId } = req.params as MemberParam;

    const membership = await this.service.findMembership(req.tenantId, id, userId);
    if (!membership) {
      return sendError(
        reply,
        HTTP_STATUS.NOT_FOUND,
        'MEMBER_NOT_FOUND',
        'User is not a member of this team',
      );
    }

    await this.service.removeMember(req.tenantId, membership.id);
    return sendSuccess(reply, { teamId: id, userId });
  };
}
