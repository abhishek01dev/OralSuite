import mongoose, { type Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: string;
  tenantId: string;
  action: string;
  modelType: string;
  modelId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

const auditLogSchema = new mongoose.Schema<IAuditLog>(
  {
    userId: { type: String, required: true, index: true },
    tenantId: { type: String, required: true, index: true },
    action: {
      type: String,
      required: true,
      enum: ['create', 'update', 'delete', 'login', 'logout', 'access', 'export'],
    },
    modelType: { type: String, required: true },
    modelId: { type: String, required: true },
    oldValues: { type: mongoose.Schema.Types.Mixed, default: null },
    newValues: { type: mongoose.Schema.Types.Mixed, default: null },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    collection: 'audit_logs',
    timestamps: false,
    versionKey: false,
  },
);

auditLogSchema.index({ tenantId: 1, timestamp: -1 });
auditLogSchema.index({ tenantId: 1, modelType: 1, modelId: 1 });
auditLogSchema.index({ tenantId: 1, userId: 1, timestamp: -1 });
auditLogSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }, // 90-day TTL
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
