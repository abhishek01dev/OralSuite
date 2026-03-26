import { prisma } from '@repo/db-mysql';
import type { Prisma } from '@repo/db-mysql';
import type { CreatePatientDto, UpdatePatientDto, PaginationDto } from '@repo/shared';

export class PatientsService {
  async list(tenantId: string, query: PaginationDto) {
    const { limit = 20, cursor, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const findManyArgs: Prisma.PatientFindManyArgs = {
      where: {
        tenantId,
      },
      take: limit + 1,
      orderBy: {
        [sortBy]: sortOrder,
      },
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
    }

    const items = await prisma.patient.findMany(findManyArgs);

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
    return prisma.patient.findUnique({
      where: {
        id,
        tenantId,
      },
      include: {
        appointments: {
          orderBy: { startTime: 'desc' },
          take: 5,
        },
        treatments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        invoices: {
          orderBy: { dueDate: 'desc' },
          take: 5,
        },
      },
    });
  }

  async create(tenantId: string, data: CreatePatientDto) {
    return prisma.patient.create({
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        tenantId,
      },
    });
  }

  async update(tenantId: string, id: string, data: UpdatePatientDto) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }

    return prisma.patient.update({
      where: {
        id,
        tenantId,
      },
      data: updateData,
    });
  }

  async delete(tenantId: string, id: string) {
    return prisma.patient.delete({
      where: {
        id,
        tenantId,
      },
    });
  }
}
