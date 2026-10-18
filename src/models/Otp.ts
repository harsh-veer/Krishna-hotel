import mongoose, { Schema, Document, Model } from "mongoose";

// One document per email address. Mongo deletes it automatically after expiresAt.
export interface IOtp extends Document {
  email: string;
  codeHash: string;
  attempts: number;
  sendCount: number;
  windowStart: Date;
  lastSentAt: Date;
  verifiedAt?: Date;
  expiresAt: Date;
}

const OtpSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, required: true, default: 0 },
  sendCount: { type: Number, required: true, default: 0 },
  windowStart: { type: Date, required: true, default: Date.now },
  lastSentAt: { type: Date, required: true, default: Date.now },
  verifiedAt: { type: Date, required: false },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);
