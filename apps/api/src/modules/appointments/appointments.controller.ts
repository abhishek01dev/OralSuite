import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  HTTP_STATUS,
  createAppointmentDto,
  updateAppointmentDto,
  paginationSchema,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { AppointmentsService } from './appointments.service.js';

export class AppointmentsController {
  private readonly service = new AppointmentsService();

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
    const appointment = await this.service.getById(req.tenantId, id);
    if (!appointment) return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Appointment not found');
    return sendSuccess(reply, appointment);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createAppointmentDto.safeParse(req.body);
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
      const appointment = await this.service.create(req.tenantId, parsed.data);
      return sendSuccess(reply, appointment, HTTP_STATUS.CREATED);
    } catch (e: any) {
      return sendError(reply, HTTP_STATUS.BAD_REQUEST, 'BAD_REQUEST', e.message);
    }
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = updateAppointmentDto.safeParse(req.body);
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
      const appointment = await this.service.update(req.tenantId, id, parsed.data);
      return sendSuccess(reply, appointment);
    } catch (e: any) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Appointment not found');
    }
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      await this.service.delete(req.tenantId, id);
      return sendSuccess(reply, { message: 'Appointment deleted successfully' });
    } catch {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Appointment not found');
    }
  };
}
