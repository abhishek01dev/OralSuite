import mongoose, { type Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: string;
  tenantId: string;
  type: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const activityLogSchema = new mongoose.Schema<IActivityLog>(
  {
    userId: { type: String, required: true, index: true },
    tenantId: { type: String, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ['page_view', 'action', 'api_call', 'error', 'system'],
    },
    description: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  {
    collection: 'activity_logs',
    timestamps: false,
    versionKey: false,
  },
);

activityLogSchema.index({ tenantId: 1, createdAt: -1 });
activityLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }, // 30-day TTL
);

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
