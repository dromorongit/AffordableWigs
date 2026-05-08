import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  key: string;
  value: any; // Can be string, number, boolean, etc.
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      required: [true, "Settings key is required"],
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: [true, "Settings value is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
SettingsSchema.index({ key: 1 });

const Settings: Model<ISettings> =
  mongoose.models?.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;