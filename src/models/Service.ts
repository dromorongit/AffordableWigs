import mongoose, { Schema, Document } from 'mongoose';

/**
 * Service Schema
 * Represents wig styling and other services offered by the brand
 */
export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  duration?: string;
  image?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: [100, 'Service name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: String,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ServiceSchema.index({ order: 1 });
ServiceSchema.index({ isActive: 1 });

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);