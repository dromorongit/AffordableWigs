import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
ServiceSchema.index({ isActive: 1, sortOrder: 1 });

const Service: Model<IService> =
  mongoose.models?.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;