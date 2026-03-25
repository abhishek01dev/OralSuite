import mongoose, { type Document } from 'mongoose';

export interface ICartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  metadata?: Record<string, unknown>;
}

export interface ICartSession extends Document {
  sessionId: string;
  userId: string | null;
  tenantId: string;
  items: ICartItem[];
  mergedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new mongoose.Schema<ICartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

const cartSessionSchema = new mongoose.Schema<ICartSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, default: null, index: true },
    tenantId: { type: String, required: true, index: true },
    items: [cartItemSchema],
    mergedAt: { type: Date, default: null },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    collection: 'cart_sessions',
    timestamps: true,
    versionKey: false,
  },
);

cartSessionSchema.index({ tenantId: 1, userId: 1 });
cartSessionSchema.index({ tenantId: 1, sessionId: 1 });
cartSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const CartSession = mongoose.model<ICartSession>('CartSession', cartSessionSchema);
