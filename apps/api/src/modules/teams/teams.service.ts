import { createTenantPrisma } from '@repo/db-mysql';
import { PAGINATION } from '@repo/shared';
import type { PaginationDto } from '@repo/shared';

const USER_BRIEF_SELECT = { id: true, firstName: true, lastName: true, email: true } as const;

const TEAM_LIST_INCLUDE = {
  department: { select: { id: true, name: true } },
  lead: { select: USER_BRIEF_SELECT },
  _count: { select: { teamUsers: true } },
} as const;

const TEAM_DETAIL_INCLUDE = {
  department: { select: { id: true, name: true } },
  lead: { select: USER_BRIEF_SELECT },
  teamUsers: {
    include: { user: { select: USER_BRIEF_SELECT } },
    orderBy: { joinedAt: 'desc' as const },
  },
} as const;

const TEAM_WITH_DEPT_LEAD = {
  department: { select: { id: true, name: true } },
  lead: { select: USER_BRIEF_SELECT },
} as const;

interface TeamListFilters {
  departmentId?: string;
}

export class TeamsService {
  async list(tenantId: string, params: PaginationDto, filters: TeamListFilters) {
    const db = createTenantPrisma(tenantId);
    const { cursor, limit, sortBy, sortOrder } = params;
    const take = Math.min(limit, PAGINATION.MAX_LIMIT);

    const where = filters.departmentId ? { departmentId: filters.departmentId } : {};

    const teams = await db.team.findMany({
      where,
      take: take + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { [sortBy ?? 'createdAt']: sortOrder },
      include: TEAM_LIST_INCLUDE,
    });

    const hasMore = teams.length > take;
    if (hasMore) teams.pop();
    const nextCursor = teams.length > 0 ? teams[teams.length - 1]!.id : null;

    return { data: teams, meta: { cursor: nextCursor, hasMore } };
  }

  async getById(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.team.findUnique({ where: { id }, include: TEAM_DETAIL_INCLUDE });
  }

  async create(
    tenantId: string,
    data: { name: string; departmentId: string; leadUserId?: string | null },
  ) {
    const db = createTenantPrisma(tenantId);
    return db.team.create({
      data: {
        name: data.name,
        departmentId: data.departmentId,
        leadUserId: data.leadUserId ?? null,
        tenantId,
      },
      include: TEAM_WITH_DEPT_LEAD,
    });
  }

  async update(tenantId: string, id: string, data: Record<string, unknown>) {
    const db = createTenantPrisma(tenantId);
    return db.team.update({ where: { id }, data, include: TEAM_WITH_DEPT_LEAD });
  }

  async getWithMemberCount(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.team.findUnique({
      where: { id },
      include: { _count: { select: { teamUsers: true } } },
    });
  }

  async delete(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    await db.team.delete({ where: { id } });
    return { id };
  }

  async addMember(tenantId: string, teamId: string, userId: string) {
    const db = createTenantPrisma(tenantId);
    return db.teamUser.create({
      data: { teamId, userId, tenantId },
      include: { user: { select: USER_BRIEF_SELECT } },
    });
  }

  async findMembership(tenantId: string, teamId: string, userId: string) {
    const db = createTenantPrisma(tenantId);
    return db.teamUser.findFirst({
      where: { teamId, userId },
      select: { id: true },
    });
  }

  async removeMember(tenantId: string, membershipId: string) {
    const db = createTenantPrisma(tenantId);
    await db.teamUser.delete({ where: { id: membershipId } });
  }

  async exists(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.team.findUnique({ where: { id }, select: { id: true } });
  }

  async departmentExists(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.department.findUnique({ where: { id }, select: { id: true } });
  }

  async userExists(tenantId: string, id: string) {
    const db = createTenantPrisma(tenantId);
    return db.user.findUnique({ where: { id }, select: { id: true } });
  }
}
