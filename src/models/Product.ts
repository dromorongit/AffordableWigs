import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  mainImage: string;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  tags: string[];
  // Future-ready optional fields
  length?: string;
  texture?: string;
  color?: string;
  capSize?: string;
  laceType?: string;
  density?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Compare-at price cannot be negative"],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    mainImage: {
      type: String,
      required: [true, "Main product image is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    // Future-ready optional fields
    length: {
      type: String,
      trim: true,
    },
    texture: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    capSize: {
      type: String,
      trim: true,
    },
    laceType: {
      type: String,
      trim: true,
    },
    density: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isBestSeller: 1 });
ProductSchema.index({ isNewArrival: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ name: "text", tags: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
