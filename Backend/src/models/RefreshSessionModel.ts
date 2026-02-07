import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

// Stores server-side refresh sessions so we can revoke them (logout, single-device, compromise, etc.)
// We never store the raw refresh token, only a hash.

const refreshSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    jti: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    replacedByJti: { type: String, default: null },
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
  },
  { timestamps: true }
);

// Automatically delete documents when expiresAt is reached
refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RefreshSession = InferSchemaType<typeof refreshSessionSchema>;

const RefreshSessionModel =
  (mongoose.models.RefreshSession as Model<RefreshSession> | undefined) ||
  mongoose.model<RefreshSession>('RefreshSession', refreshSessionSchema);

export default RefreshSessionModel;
