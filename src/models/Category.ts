import mongoose, { Schema, Document } from 'mongoose';

/**
 * Category Schema
 * Represents product categories (Ready-to-Wear Wigs, Wig Bundles, Closures, Frontals)
 */
export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ order: 1 });

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);