import mongoose, { Schema, Model } from "mongoose";

// One document (key "site") holding settings the hotel edits from /admin.
export interface ISettings {
  key: string;
  offer: { enabled: boolean; text: string; textHi: string; link: string };
  inventory: Record<string, number>;
  updatedAt?: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true },
    offer: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: "" },
      textHi: { type: String, default: "" },
      link: { type: String, default: "" },
    },
    inventory: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
