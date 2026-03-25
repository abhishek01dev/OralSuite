import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  HTTP_STATUS,
  createTreatmentChartDto,
  updateTreatmentChartDto,
  paginationSchema,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { ChartingService } from './charting.service.js';

export class ChartingController {
  private readonly service = new ChartingService();

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
    const patientId = (req.query as any).patientId as string | undefined;
    const result = await this.service.list(req.tenantId, { ...parsed.data, patientId });
    return sendSuccess(reply, result.data, HTTP_STATUS.OK, result.meta);
  };

  getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const chart = await this.service.getById(req.tenantId, id);
    if (!chart) return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Chart record not found');
    return sendSuccess(reply, chart);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createTreatmentChartDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid request body',
        parsed.error.flatten().fieldErrors,
      );
    }
    
    try {
      const chart = await this.service.create(req.tenantId, parsed.data);
      return sendSuccess(reply, chart, HTTP_STATUS.CREATED);
    } catch (e: any) {
      return sendError(reply, HTTP_STATUS.BAD_REQUEST, 'BAD_REQUEST', e.message);
    }
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = updateTreatmentChartDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid request body',
        parsed.error.flatten().fieldErrors,
      );
    }
    
    try {
      const chart = await this.service.update(req.tenantId, id, parsed.data);
      return sendSuccess(reply, chart);
    } catch (e: any) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Chart record not found');
    }
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      await this.service.delete(req.tenantId, id);
      return sendSuccess(reply, { message: 'Chart record deleted successfully' });
    } catch {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Chart record not found');
    }
  };
}
