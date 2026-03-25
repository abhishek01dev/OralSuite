import { prisma } from '@repo/db-mysql';
import { Prisma } from '@repo/db-mysql';
import type { CreateInventoryItemDto, UpdateInventoryItemDto, CreateStockTransactionDto, PaginationDto } from '@repo/shared';

export class InventoryService {
  async listItems(tenantId: string, query: PaginationDto & { category?: string }) {
    const { limit = 20, cursor, sortBy = 'name', sortOrder = 'asc', category } = query;

    const findManyArgs: Prisma.InventoryItemFindManyArgs = {
      where: {
        tenantId,
        ...(category ? { category } : {})
      },
      take: limit + 1,
      orderBy: {
        [sortBy]: sortOrder,
      },
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
    }

    const items = await prisma.inventoryItem.findMany(findManyArgs);
    
    let nextCursor: string | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return {
      data: items,
      meta: {
        nextCursor,
        limit,
      },
    };
  }

  async getItemById(tenantId: string, id: string) {
    return prisma.inventoryItem.findUnique({
      where: {
        id,
        tenantId,
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    });
  }

  async createItem(tenantId: string, data: CreateInventoryItemDto) {
    return prisma.inventoryItem.create({
      data: {
        ...data,
        tenantId,
      }
    });
  }

  async updateItem(tenantId: string, id: string, data: UpdateInventoryItemDto) {
    return prisma.inventoryItem.update({
      where: {
        id,
        tenantId,
      },
      data
    });
  }

  async deleteItem(tenantId: string, id: string) {
    return prisma.inventoryItem.delete({
      where: {
        id,
        tenantId,
      },
    });
  }

  async recordStockTransaction(tenantId: string, id: string, userId: string, data: CreateStockTransactionDto) {
    const item = await prisma.inventoryItem.findUnique({ where: { id, tenantId } });
    if (!item) throw new Error('Inventory item not found');

    const amountChange = data.type === 'in' ? data.quantity : -data.quantity;
    const newQuantity = item.quantity + amountChange;

    if (newQuantity < 0) throw new Error('Insufficient stock for this transaction');

    return prisma.$transaction(async (tx) => {
      const transaction = await tx.stockTransaction.create({
        data: {
          itemId: id,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          performedBy: userId
        }
      });
      
      await tx.inventoryItem.update({
        where: { id },
        data: { quantity: newQuantity }
      });
      
      return transaction;
    });
  }
}
