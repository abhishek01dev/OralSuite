import mongoose, { type Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  tenantId: string;
  type: string;
  title: string;
  body: string;
  readAt: Date | null;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    tenantId: { type: String, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ['info', 'warning', 'error', 'success', 'system'],
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    readAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'notifications',
    timestamps: false,
    versionKey: false,
  },
);

notificationSchema.index({ tenantId: 1, userId: 1, createdAt: -1 });
notificationSchema.index({ tenantId: 1, userId: 1, readAt: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
