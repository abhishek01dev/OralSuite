import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  HTTP_STATUS,
  createInventoryItemDto,
  updateInventoryItemDto,
  createStockTransactionDto,
  paginationSchema,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { InventoryService } from './inventory.service.js';

export class InventoryController {
  private readonly service = new InventoryService();

  listItems = async (req: FastifyRequest, reply: FastifyReply) => {
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
    const category = (req.query as Record<string, string | undefined>).category;
    const result = await this.service.listItems(req.tenantId, { ...parsed.data, category });
    return sendSuccess(reply, result.data, HTTP_STATUS.OK, result.meta);
  };

  getItemById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const item = await this.service.getItemById(req.tenantId, id);
    if (!item)
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Inventory item not found');
    return sendSuccess(reply, item);
  };

  createItem = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createInventoryItemDto.safeParse(req.body);
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
      const item = await this.service.createItem(req.tenantId, parsed.data);
      return sendSuccess(reply, item, HTTP_STATUS.CREATED);
    } catch (e: unknown) {
      return sendError(
        reply,
        HTTP_STATUS.BAD_REQUEST,
        'BAD_REQUEST',
        e instanceof Error ? e.message : 'Unknown error',
      );
    }
  };

  updateItem = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = updateInventoryItemDto.safeParse(req.body);
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
      const item = await this.service.updateItem(req.tenantId, id, parsed.data);
      return sendSuccess(reply, item);
    } catch {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Inventory item not found');
    }
  };

  deleteItem = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      await this.service.deleteItem(req.tenantId, id);
      return sendSuccess(reply, { message: 'Inventory item deleted successfully' });
    } catch {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Inventory item not found');
    }
  };

  recordTransaction = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = createStockTransactionDto.safeParse(req.body);
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
      const transaction = await this.service.recordStockTransaction(
        req.tenantId,
        id,
        (req.user as Record<string, string>)?.id ?? '',
        parsed.data,
      );
      return sendSuccess(reply, transaction, HTTP_STATUS.CREATED);
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'Inventory item not found') {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Inventory item not found');
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
