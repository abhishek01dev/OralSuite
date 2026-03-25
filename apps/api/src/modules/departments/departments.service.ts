import { createTenantPrisma } from '@repo/db-mysql';
import { PAGINATION } from '@repo/shared';
import type { PaginationDto } from '@repo/shared';

interface DepartmentNode {
  id: string;
  name: string;
  parentId: string | null;
  headUserId: string | null;
  head: { id: string; firstName: string; lastName: string; email: string } | null;
  children: DepartmentNode[];
  createdAt: Date;
  updatedAt: Date;
}

const HEAD_SELECT = { id: true, firstName: true, lastName: true, email: true } as const;

const buildTree = (
  departments: Array<{
    id: string;
    name: string;
    parentId: string | null;
    headUserId: string | null;
    head: { id: string; firstName: string; lastName: string; email: string } | null;
    createdAt: Date;
    updatedAt: Date;
  }>,
): DepartmentNode[] => {
  const map = new Map<string, DepartmentNode>();
  const roots: DepartmentNode[] = [];

  for (const dept of departments) {
    map.set(dept.id, { ...dept, children: [] });
  }

  for (const dept of departments) {
    const node = map.get(dept.id)!;
    if (dept.parentId && map.has(dept.parentId)) {
      map.get(dept.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};

export class DepartmentsService {
  async list(tenantId: string, params: PaginationDto) {
    const db = createTenantPrisma(tenantId);
    const { cursor, limit, sortBy, sortOrder } = params;
    const take = Math.min(limit, PAGINATION.MAX_LIMIT);

    const departments = await db.department.findMany({
      take: take + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { [sortBy ?? 'createdAt']: sortOrder },
      include: {
        head: { select: HEAD_SELECT },
        parent: { select: { id: true, name: true } },
        _count: { select: { children: true, teams: true } },
      },
    });

    const hasMore = departments.length > take;
    if (hasMore) departments.pop();

    const nextCursor = departments.length > 0 ? departments[departments.length - 1]!.id : null;

    return { data: departments, meta: { cursor: nextCursor, hasMore } };
  }

  async getTree(tenantId: string) {
    const db = createTenantPrisma(tenantId);
    const departments = await db.department.findMany({
      orderBy: { name: 'asc' },
      include: { head: { select: HEAD_SELECT } },
    });
    return buildTree(departments);
  }

  async getById(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.department.findUnique({
      where: { id },
      include: {
        head: { select: HEAD_SELECT },
        parent: { select: { id: true, name: true } },
        children: { select: { id: true, name: true } },
        teams: { select: { id: true, name: true } },
      },
    });
  }

  async create(
    tenantId: string,
    data: { name: string; parentId?: string | null; headUserId?: string | null },
  ) {
    const db = createTenantPrisma(tenantId);
    return db.department.create({
      data: {
        name: data.name,
        parentId: data.parentId ?? null,
        headUserId: data.headUserId ?? null,
        tenantId,
      },
      include: {
        head: { select: HEAD_SELECT },
        parent: { select: { id: true, name: true } },
      },
    });
  }

  async update(tenantId: string, id: string, data: Record<string, unknown>) {
    const db = createTenantPrisma(tenantId);
    return db.department.update({
      where: { id },
      data,
      include: {
        head: { select: HEAD_SELECT },
        parent: { select: { id: true, name: true } },
      },
    });
  }

  async getWithRelations(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.department.findUnique({
      where: { id },
      include: {
        children: { select: { id: true } },
        teams: { select: { id: true } },
      },
    });
  }

  async delete(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    await db.department.delete({ where: { id } });
    return { id };
  }

  async exists(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.department.findUnique({ where: { id }, select: { id: true } });
  }

  async userExists(tenantId: string, userId: string) {
    const db = createTenantPrisma(tenantId);
    return db.user.findUnique({ where: { id: userId }, select: { id: true } });
  }
}
