import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { AuditLog } from '@repo/db-mongo';

interface AuditEntry {
  userId: string;
  tenantId: string;
  action: string;
  modelType: string;
  modelId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
}

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const auditBuffer: AuditEntry[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

async function flushAuditBuffer(): Promise<void> {
  if (auditBuffer.length === 0) return;

  const entries = auditBuffer.splice(0, auditBuffer.length);
  try {
    await AuditLog.insertMany(
      entries.map((e) => ({ ...e, timestamp: new Date() })),
      { ordered: false },
    );
  } catch (err) {
    console.error('Failed to flush audit logs:', err);
    auditBuffer.unshift(...entries);
  }
}

async function auditPluginFn(app: FastifyInstance) {
  flushTimer = setInterval(() => {
    void flushAuditBuffer();
  }, 1000);

  app.addHook('onResponse', async (req: FastifyRequest, _reply: FastifyReply) => {
    if (!MUTATION_METHODS.has(req.method)) return;
    if (!req.userId) return;

    const urlParts = req.url.split('/').filter(Boolean);
    const modelType = urlParts[0] ?? 'unknown';
    const modelId = urlParts[1] ?? '';

    const methodActionMap: Record<string, string> = {
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };

    const entry: AuditEntry = {
      userId: req.userId,
      tenantId: req.tenantId ?? '',
      action: methodActionMap[req.method] ?? 'unknown',
      modelType,
      modelId,
      oldValues: null,
      newValues: req.body as Record<string, unknown> | null,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] ?? '',
    };

    auditBuffer.push(entry);

    if (auditBuffer.length >= 100) {
      void flushAuditBuffer();
    }
  });

  app.addHook('onClose', async () => {
    if (flushTimer) clearInterval(flushTimer);
    await flushAuditBuffer();
  });
}

export const auditPlugin = fp(auditPluginFn, {
  name: 'audit-plugin',
});

export { flushAuditBuffer };
