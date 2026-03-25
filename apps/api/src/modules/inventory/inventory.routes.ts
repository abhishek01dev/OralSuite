import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { InventoryController } from './inventory.controller.js';

export async function inventoryRoutes(app: FastifyInstance): Promise<void> {
  const controller = new InventoryController();

  app.get('/', { preHandler: [requirePermission('inventory.read')] }, controller.listItems);
  app.get('/:id', { preHandler: [requirePermission('inventory.read')] }, controller.getItemById);
  app.post('/', { preHandler: [requirePermission('inventory.create')] }, controller.createItem);
  app.put('/:id', { preHandler: [requirePermission('inventory.update')] }, controller.updateItem);
  app.delete('/:id', { preHandler: [requirePermission('inventory.delete')] }, controller.deleteItem);

  app.post('/:id/transactions', { preHandler: [requirePermission('inventory.update')] }, controller.recordTransaction);
}
