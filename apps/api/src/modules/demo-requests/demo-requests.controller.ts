import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  createDemoRequestDto,
  updateDemoRequestStatusDto,
  paginationSchema,
  HTTP_STATUS,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { DemoRequestService } from './demo-requests.service.js';

interface StatusQuery {
  status?: string;
}

export class DemoRequestController {
  private service = new DemoRequestService();

  /**
   * POST /demo-requests — Public (no auth required)
   */
  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createDemoRequestDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid demo request data',
        parsed.error.flatten(),
      );
    }

    const demoRequest = await this.service.create(parsed.data);
    return sendSuccess(reply, demoRequest, HTTP_STATUS.CREATED);
  };

  /**
   * GET /demo-requests — Admin only (auth required)
   */
  list = async (req: FastifyRequest, reply: FastifyReply) => {
    // Auth is enforced at the route level; double-check here
    if (!req.userId) {
      return sendError(reply, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED', 'Authentication required');
    }

    const query = req.query as StatusQuery & Record<string, string>;
    const pagination = paginationSchema.safeParse(query);
    const limit = pagination.success ? pagination.data.limit : 20;
    const sortOrder = pagination.success ? pagination.data.sortOrder : 'desc';
    const cursor = pagination.success ? pagination.data.cursor : undefined;
    const status = query.status as 'new' | 'contacted' | 'closed' | undefined;

    const result = await this.service.findAll({ status, limit, cursor, sortOrder });
    return sendSuccess(reply, result);
  };

  /**
   * PATCH /demo-requests/:id — Admin only (auth required)
   */
  updateStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.userId) {
      return sendError(reply, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED', 'Authentication required');
    }

    const { id } = req.params as { id: string };
    const parsed = updateDemoRequestStatusDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid status',
        parsed.error.flatten(),
      );
    }

    const existing = await this.service.findById(id);
    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Demo request not found');
    }

    const updated = await this.service.updateStatus(id, parsed.data.status);
    return sendSuccess(reply, updated);
  };

  /**
   * GET /demo-requests/stats — Admin only (auth required)
   */
  stats = async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.userId) {
      return sendError(reply, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED', 'Authentication required');
    }

    const counts = await this.service.countByStatus();
    return sendSuccess(reply, counts);
  };
}
