import { Schema, model, Document, Types } from 'mongoose';

interface IRefreshToken extends Document {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, default: Date.now, expires: "7d" },
});

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);