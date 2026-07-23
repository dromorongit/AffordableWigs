import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStylingService extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const StylingServiceSchema = new Schema<IStylingService>(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"],
      maxlength: [100, "Slug cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [1000000, "Price cannot exceed 1,000,000"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: [0, "Sort order cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

StylingServiceSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 });
StylingServiceSchema.index({ slug: 1 }, { unique: true });

const StylingService: Model<IStylingService> =
  mongoose.models?.StylingService || mongoose.model<IStylingService>("StylingService", StylingServiceSchema);

export default StylingService;
