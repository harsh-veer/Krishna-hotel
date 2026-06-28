import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  bookingId?: string;
  name: string;
  rating: number;
  text: string;
  ownerResponse?: string;
  isApproved: boolean;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  bookingId: { type: String, required: false },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  ownerResponse: { type: String, required: false },
  isApproved: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
