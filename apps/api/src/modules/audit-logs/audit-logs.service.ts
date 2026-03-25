import { AuditLog } from '@repo/db-mongo';
import { PAGINATION } from '@repo/shared';

interface AuditLogFilters {
  userId?: string;
  action?: string;
  modelType?: string;
  startDate?: string;
  endDate?: string;
}

interface AuditLogParams {
  cursor?: string;
  limit: number;
  sortOrder?: 'asc' | 'desc';
}

export class AuditLogsService {
  async list(tenantId: string, params: AuditLogParams, filters: AuditLogFilters) {
    const { cursor, limit, sortOrder = 'desc' } = params;
    const take = Math.min(limit, PAGINATION.MAX_LIMIT);

    const filter: Record<string, unknown> = { tenantId };

    if (filters.userId) filter['userId'] = filters.userId;
    if (filters.action) filter['action'] = filters.action;
    if (filters.modelType) filter['modelType'] = filters.modelType;

    if (filters.startDate || filters.endDate) {
      const timestampFilter: Record<string, Date> = {};
      if (filters.startDate) timestampFilter['$gte'] = new Date(filters.startDate);
      if (filters.endDate) timestampFilter['$lte'] = new Date(filters.endDate);
      filter['timestamp'] = timestampFilter;
    }

    if (cursor) {
      const cursorDir = sortOrder === 'asc' ? '$gt' : '$lt';
      filter['_id'] = { [cursorDir]: cursor };
    }

    const sortDir = sortOrder === 'asc' ? 1 : -1;
    type MongoFilter = Parameters<typeof AuditLog.find>[0];

    const logs = await AuditLog.find(filter as unknown as MongoFilter)
      .sort({ timestamp: sortDir, _id: sortDir })
      .limit(take + 1)
      .lean()
      .exec();

    const hasMore = logs.length > take;
    if (hasMore) logs.pop();

    const nextCursor = logs.length > 0 ? String(logs[logs.length - 1]!._id) : null;

    const total = await AuditLog.countDocuments(filter as unknown as MongoFilter).exec();

    return { data: logs, meta: { cursor: nextCursor, hasMore, total } };
  }
}
