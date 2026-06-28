import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  roomType: string;
  status: string;
  message?: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  guests: { type: String, required: true },
  roomType: { type: String, required: true, default: "Super-Deluxe Room" },
  status: { 
    type: String, 
    required: true, 
    enum: ["Pending", "Confirmed", "Cancelled", "Checked-in", "Checked-out"], 
    default: "Pending" 
  },
  message: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

// Since this is Next.js, we need to check if the model is already compiled before creating it
export const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
