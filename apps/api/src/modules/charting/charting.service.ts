import { prisma } from '@repo/db-mysql';
import { Prisma } from '@repo/db-mysql';
import type { CreateTreatmentChartDto, UpdateTreatmentChartDto, PaginationDto } from '@repo/shared';

export class ChartingService {
  async list(tenantId: string, query: PaginationDto & { patientId?: string }) {
    const { limit = 20, cursor, sortBy = 'createdAt', sortOrder = 'desc', patientId } = query;

    const findManyArgs: Prisma.TreatmentChartFindManyArgs = {
      where: {
        tenantId,
        ...(patientId ? { patientId } : {})
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        dentist: { select: { id: true, firstName: true, lastName: true } }
      },
      take: limit + 1,
      orderBy: {
        [sortBy]: sortOrder,
      },
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
    }

    const items = await prisma.treatmentChart.findMany(findManyArgs);
    
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

  async getById(tenantId: string, id: string) {
    return prisma.treatmentChart.findUnique({
      where: {
        id,
        tenantId,
      },
      include: {
        patient: true,
        dentist: true
      }
    });
  }

  async create(tenantId: string, data: CreateTreatmentChartDto) {
    return prisma.treatmentChart.create({
      data: {
        ...data,
        performedAt: data.performedAt ? new Date(data.performedAt) : null,
        tenantId,
      },
      include: {
        patient: true,
        dentist: true
      }
    });
  }

  async update(tenantId: string, id: string, data: UpdateTreatmentChartDto) {
    const updateData: any = { ...data };
    if (data.performedAt) updateData.performedAt = new Date(data.performedAt);
    
    return prisma.treatmentChart.update({
      where: {
        id,
        tenantId,
      },
      data: updateData,
      include: {
        patient: true,
        dentist: true
      }
    });
  }

  async delete(tenantId: string, id: string) {
    return prisma.treatmentChart.delete({
      where: {
        id,
        tenantId,
      },
    });
  }
}
