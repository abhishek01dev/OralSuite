import { prisma } from '@repo/db-mysql';
import type { Prisma } from '@repo/db-mysql';
import type { CreateAppointmentDto, UpdateAppointmentDto, PaginationDto } from '@repo/shared';

export class AppointmentsService {
  async list(tenantId: string, query: PaginationDto) {
    const { limit = 20, cursor, sortBy = 'startTime', sortOrder = 'asc' } = query;

    const findManyArgs: Prisma.AppointmentFindManyArgs = {
      where: {
        tenantId,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        dentist: { select: { id: true, firstName: true, lastName: true } },
      },
      take: limit + 1,
      orderBy: {
        [sortBy]: sortOrder,
      },
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
    }

    const items = await prisma.appointment.findMany(findManyArgs);

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
    return prisma.appointment.findUnique({
      where: {
        id,
        tenantId,
      },
      include: {
        patient: true,
        dentist: true,
      },
    });
  }

  async create(tenantId: string, data: CreateAppointmentDto) {
    return prisma.appointment.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        tenantId,
      },
      include: {
        patient: true,
        dentist: true,
      },
    });
  }

  async update(tenantId: string, id: string, data: UpdateAppointmentDto) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);

    return prisma.appointment.update({
      where: {
        id,
        tenantId,
      },
      data: updateData,
      include: {
        patient: true,
        dentist: true,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    return prisma.appointment.delete({
      where: {
        id,
        tenantId,
      },
    });
  }
}
