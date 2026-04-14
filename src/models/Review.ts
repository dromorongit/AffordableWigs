import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  customerName: string;
  message: string;
  rating: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Review message is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
ReviewSchema.index({ isVisible: 1, createdAt: -1 });

const Review: Model<IReview> =
  mongoose.models?.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;