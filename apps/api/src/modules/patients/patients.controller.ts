import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  HTTP_STATUS,
  createPatientDto,
  updatePatientDto,
  paginationSchema,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { PatientsService } from './patients.service.js';

export class PatientsController {
  private readonly service = new PatientsService();

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
    const patient = await this.service.getById(req.tenantId, id);
    if (!patient) return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Patient not found');
    return sendSuccess(reply, patient);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createPatientDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid request body',
        parsed.error.flatten().fieldErrors,
      );
    }
    const patient = await this.service.create(req.tenantId, parsed.data);
    return sendSuccess(reply, patient, HTTP_STATUS.CREATED);
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = updatePatientDto.safeParse(req.body);
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
      const patient = await this.service.update(req.tenantId, id, parsed.data);
      return sendSuccess(reply, patient);
    } catch (e) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Patient not found');
    }
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      await this.service.delete(req.tenantId, id);
      return sendSuccess(reply, { message: 'Patient deleted successfully' });
    } catch {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Patient not found');
    }
  };
}
