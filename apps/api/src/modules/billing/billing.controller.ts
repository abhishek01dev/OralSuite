import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  HTTP_STATUS,
  createInvoiceDto,
  updateInvoiceDto,
  createPaymentDto,
  paginationSchema,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { BillingService } from './billing.service.js';

export class BillingController {
  private readonly service = new BillingService();

  listInvoices = async (req: FastifyRequest, reply: FastifyReply) => {
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
    const patientId = (req.query as Record<string, string | undefined>).patientId;
    const status = (req.query as Record<string, string | undefined>).status;
    const result = await this.service.listInvoices(req.tenantId, {
      ...parsed.data,
      patientId,
      status,
    });
    return sendSuccess(reply, result.data, HTTP_STATUS.OK, result.meta);
  };

  getInvoiceById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const invoice = await this.service.getInvoiceById(req.tenantId, id);
    if (!invoice) return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Invoice not found');
    return sendSuccess(reply, invoice);
  };

  createInvoice = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createInvoiceDto.safeParse(req.body);
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
      const invoice = await this.service.createInvoice(req.tenantId, parsed.data);
      return sendSuccess(reply, invoice, HTTP_STATUS.CREATED);
    } catch (e: unknown) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'BAD_REQUEST',
        e instanceof Error ? e.message : 'Unknown error',
      );
    }
  };

  updateInvoice = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = updateInvoiceDto.safeParse(req.body);
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
      const invoice = await this.service.updateInvoice(req.tenantId, id, parsed.data);
      return sendSuccess(reply, invoice);
    } catch {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Invoice not found');
    }
  };

  deleteInvoice = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      await this.service.deleteInvoice(req.tenantId, id);
      return sendSuccess(reply, { message: 'Invoice deleted successfully' });
    } catch {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Invoice not found');
    }
  };

  addPayment = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = createPaymentDto.safeParse(req.body);
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
      const payment = await this.service.addPayment(req.tenantId, id, parsed.data);
      return sendSuccess(reply, payment, HTTP_STATUS.CREATED);
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'Invoice not found') {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Invoice not found');
      }
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'BAD_REQUEST',
        e instanceof Error ? e.message : 'Unknown error',
      );
    }
  };
}
