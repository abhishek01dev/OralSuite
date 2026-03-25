import { prisma } from '@repo/db-mysql';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS } from '@repo/shared';
import { sendSuccess } from '@utils/response.js';

export async function getDashboardStats(req: FastifyRequest, reply: FastifyReply) {
  const tenantId = req.tenantId;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalPatients,
    todayAppointments,
    pendingInvoices,
    recentPayments,
    lowStockItems
  ] = await Promise.all([
    prisma.patient.count({ where: { tenantId } }),
    prisma.appointment.count({
      where: {
        tenantId,
        startTime: { gte: today },
      }
    }),
    prisma.invoice.count({
      where: {
        tenantId,
        status: { in: ['pending', 'overdue'] }
      }
    }),
    prisma.payment.aggregate({
      where: {
        invoice: { tenantId },
        paymentDate: { gte: today } // roughly today's revenue
      },
      _sum: { amount: true }
    }),
    prisma.inventoryItem.count({
      where: {
        tenantId,
        quantity: { lte: prisma.inventoryItem.fields.minQuantity }
      }
    })
  ]);

  return sendSuccess(reply, {
    totalPatients,
    todayAppointments,
    pendingInvoices,
    todaysRevenue: recentPayments._sum.amount || 0,
    lowStockItems
  }, HTTP_STATUS.OK);
}
