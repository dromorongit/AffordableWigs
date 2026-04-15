import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  mainImage?: string;
}

export interface ICustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  cityOrTown: string;
  regionOrArea: string;
  orderNotes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: ICustomerInfo;
  items: IOrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  paymentReference?: string;
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  orderStatus: "Processing" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  userId?: string; // Optional: links order to a registered user
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    mainImage: {
      type: String,
    },
  },
  { _id: false }
);

const CustomerInfoSchema = new Schema<ICustomerInfo>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },
    cityOrTown: {
      type: String,
      required: true,
      trim: true,
    },
    regionOrArea: {
      type: String,
      required: true,
      trim: true,
    },
    orderNotes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: CustomerInfoSchema,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (v: IOrderItem[]) {
          return v.length > 0;
        },
        message: "Order must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "GHS",
    },
    paymentReference: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Paid", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    userId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ "customer.email": 1 });
OrderSchema.index({ "customer.phone": 1 });
OrderSchema.index({ paymentReference: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ userId: 1 });

const Order: Model<IOrder> =
  mongoose.models?.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;