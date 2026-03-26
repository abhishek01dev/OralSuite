import { prisma } from '@repo/db-mysql';
import type { Prisma } from '@repo/db-mysql';
import type {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreatePaymentDto,
  PaginationDto,
} from '@repo/shared';

function generateInvoiceNo() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'INV-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export class BillingService {
  async listInvoices(
    tenantId: string,
    query: PaginationDto & { patientId?: string; status?: string },
  ) {
    const {
      limit = 20,
      cursor,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      patientId,
      status,
    } = query;

    const findManyArgs: Prisma.InvoiceFindManyArgs = {
      where: {
        tenantId,
        ...(patientId ? { patientId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
      },
      take: limit + 1,
      orderBy: {
        [sortBy]: sortOrder,
      },
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
    }

    const items = await prisma.invoice.findMany(findManyArgs);

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

  async getInvoiceById(tenantId: string, id: string) {
    return prisma.invoice.findUnique({
      where: {
        id,
        tenantId,
      },
      include: {
        patient: true,
        lineItems: true,
        payments: { orderBy: { paymentDate: 'desc' } },
      },
    });
  }

  async createInvoice(tenantId: string, data: CreateInvoiceDto) {
    const invoiceNo = generateInvoiceNo();

    return prisma.invoice.create({
      data: {
        tenantId,
        patientId: data.patientId,
        invoiceNo,
        status: data.status,
        subtotal: data.subtotal,
        tax: data.tax,
        discount: data.discount,
        total: data.total,
        dueDate: new Date(data.dueDate),
        lineItems: {
          create: data.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: {
        patient: true,
        lineItems: true,
      },
    });
  }

  async updateInvoice(tenantId: string, id: string, data: UpdateInvoiceDto) {
    const updateData: any = { ...data };
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);

    // Simplification for this implementation plan: we don't update line items
    // lineItems updates would require deleting orphans and replacing/upserting
    delete updateData.lineItems;

    return prisma.invoice.update({
      where: {
        id,
        tenantId,
      },
      data: updateData,
      include: {
        patient: true,
        lineItems: true,
        payments: true,
      },
    });
  }

  async deleteInvoice(tenantId: string, id: string) {
    return prisma.invoice.delete({
      where: {
        id,
        tenantId,
      },
    });
  }

  async addPayment(tenantId: string, id: string, data: CreatePaymentDto) {
    const invoice = await prisma.invoice.findUnique({ where: { id, tenantId } });
    if (!invoice) throw new Error('Invoice not found');

    // Create payment and update invoice paid amount in a transaction
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId: id,
          amount: data.amount,
          method: data.method,
          reference: data.reference,
          notes: data.notes,
        },
      });

      const newPaidAmount = Number(invoice.amountPaid) + data.amount;
      const newStatus = newPaidAmount >= Number(invoice.total) ? 'paid' : invoice.status;

      await tx.invoice.update({
        where: { id },
        data: {
          amountPaid: newPaidAmount,
          status: newStatus,
        },
      });

      return payment;
    });
  }
}
