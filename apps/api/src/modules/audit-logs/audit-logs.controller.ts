import type { FastifyRequest, FastifyReply } from 'fastify';
import { paginationSchema, HTTP_STATUS } from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { AuditLogsService } from './audit-logs.service.js';
import { z } from 'zod';

const auditFilterSchema = paginationSchema.extend({
  userId: z.string().optional(),
  action: z.enum(['create', 'update', 'delete', 'login', 'logout', 'access', 'export']).optional(),
  modelType: z.string().optional(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
});

export class AuditLogsController {
  private readonly service = new AuditLogsService();

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = auditFilterSchema.safeParse(req.query);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid filter parameters',
        parsed.error.flatten(),
      );
    }

    const { cursor, limit, sortOrder, userId, action, modelType, startDate, endDate } = parsed.data;

    const result = await this.service.list(
      req.tenantId,
      { cursor, limit, sortOrder },
      { userId, action, modelType, startDate, endDate },
    );

    return sendSuccess(reply, result);
  };
}
