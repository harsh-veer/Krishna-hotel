import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEventBooking extends Document {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string; // YYYY-MM-DD
  slot: string;
  guests: number;
  message?: string;
  status: string;
  createdAt: Date;
}

const EventBookingSchema = new Schema<IEventBooking>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: String, required: true, index: true },
  slot: { type: String, required: true },
  guests: { type: Number, required: true },
  message: { type: String },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const EventBooking: Model<IEventBooking> =
  mongoose.models.EventBooking || mongoose.model<IEventBooking>("EventBooking", EventBookingSchema);
