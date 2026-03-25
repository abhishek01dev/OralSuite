import type { FastifyInstance } from 'fastify';
import { requirePermission } from '@plugins/authorize.js';
import { BillingController } from './billing.controller.js';

export async function billingRoutes(app: FastifyInstance): Promise<void> {
  const controller = new BillingController();

  app.get('/invoices', { preHandler: [requirePermission('billing.read')] }, controller.listInvoices);
  app.get('/invoices/:id', { preHandler: [requirePermission('billing.read')] }, controller.getInvoiceById);
  app.post('/invoices', { preHandler: [requirePermission('billing.create')] }, controller.createInvoice);
  app.put('/invoices/:id', { preHandler: [requirePermission('billing.update')] }, controller.updateInvoice);
  app.delete('/invoices/:id', { preHandler: [requirePermission('billing.delete')] }, controller.deleteInvoice);

  app.post('/invoices/:id/payments', { preHandler: [requirePermission('billing.create')] }, controller.addPayment);
}
