import { prisma } from '@repo/db-mysql';
import type { CreateDemoRequestDto } from '@repo/shared';

type StatusFilter = 'new' | 'contacted' | 'closed';

interface ListOptions {
  status?: StatusFilter;
  limit?: number;
  cursor?: string;
  sortOrder?: 'asc' | 'desc';
}

export class DemoRequestService {
  async create(data: CreateDemoRequestDto) {
    return prisma.demoRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        description: data.description,
      },
    });
  }

  async findAll(options: ListOptions = {}) {
    const { status, limit = 20, cursor, sortOrder = 'desc' } = options;

    const where = status ? { status } : {};

    const items = await prisma.demoRequest.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: sortOrder },
    });

    const hasMore = items.length > limit;
    if (hasMore) items.pop();

    return {
      items,
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
      total: await prisma.demoRequest.count({ where }),
    };
  }

  async findById(id: string) {
    return prisma.demoRequest.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: StatusFilter) {
    return prisma.demoRequest.update({
      where: { id },
      data: { status },
    });
  }

  async countByStatus() {
    const [total, newCount, contactedCount, closedCount] = await Promise.all([
      prisma.demoRequest.count(),
      prisma.demoRequest.count({ where: { status: 'new' } }),
      prisma.demoRequest.count({ where: { status: 'contacted' } }),
      prisma.demoRequest.count({ where: { status: 'closed' } }),
    ]);
    return { total, new: newCount, contacted: contactedCount, closed: closedCount };
  }
}
