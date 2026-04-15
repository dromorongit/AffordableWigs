/**
 * Input Validation & Sanitization Utilities
 */

import { z, ZodError } from "zod";

/**
 * Sanitize string input to prevent XSS and injection
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Ghana format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+233|0|233)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate price is positive number
 */
export function isValidPrice(price: number): boolean {
  return typeof price === "number" && price > 0 && isFinite(price);
}

/**
 * Validate quantity is non-negative integer
 */
export function isValidQuantity(quantity: number): boolean {
  return typeof quantity === "number" && Number.isInteger(quantity) && quantity >= 0;
}

// Product validation schema
export const productSchema = z.object({
  name: z.string()
    .min(1, "Product name is required")
    .max(200, "Product name cannot exceed 200 characters")
    .transform(sanitizeString),
  category: z.string().min(1, "Category is required"),
  price: z.number()
    .positive("Price must be a positive number")
    .max(1000000, "Price cannot exceed 1,000,000"),
  compareAtPrice: z.number().optional(),
  stockQuantity: z.number()
    .int("Stock quantity must be an integer")
    .min(0, "Stock quantity cannot be negative"),
  mainImage: z.string().min(1, "Main image is required"),
  images: z.array(z.string()).optional(),
  shortDescription: z.string().max(300).optional(),
  description: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  length: z.string().optional(),
  texture: z.string().optional(),
  color: z.string().optional(),
  capSize: z.string().optional(),
  laceType: z.string().optional(),
  density: z.string().optional(),
});

// Category validation schema
export const categorySchema = z.object({
  name: z.string()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters")
    .transform(sanitizeString),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// Order validation schema
export const orderSchema = z.object({
  customer: z.object({
    fullName: z.string()
      .min(1, "Full name is required")
      .max(100, "Name cannot exceed 100 characters")
      .transform(sanitizeString),
    phone: z.string()
      .min(1, "Phone number is required")
      .refine(isValidPhone, { message: "Invalid phone number format" }),
    email: z.string()
      .email("Invalid email address")
      .transform((val: string) => val.toLowerCase().trim()),
    deliveryAddress: z.string()
      .min(1, "Delivery address is required")
      .max(500, "Address cannot exceed 500 characters")
      .transform(sanitizeString),
    cityOrTown: z.string()
      .min(1, "City/Town is required")
      .max(100, "City/Town cannot exceed 100 characters")
      .transform(sanitizeString),
    regionOrArea: z.string()
      .min(1, "Region/Area is required")
      .max(100, "Region/Area cannot exceed 100 characters")
      .transform(sanitizeString),
    orderNotes: z.string().max(1000).optional(),
  }),
  items: z.array(z.object({
    product: z.object({
      _id: z.string(),
      name: z.string(),
      slug: z.string(),
      price: z.number(),
    }),
    quantity: z.number().int().positive("Quantity must be at least 1"),
  })).min(1, "Order must have at least one item"),
  subtotal: z.number().positive(),
  total: z.number().positive(),
  currency: z.string().optional(),
});

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .transform((val: string) => val.toLowerCase().trim()),
  password: z.string()
    .min(1, "Password is required")
    .max(100, "Password cannot exceed 100 characters"),
});

// Payment initialization schema
export const paymentInitSchema = z.object({
  customer: z.object({
    fullName: z.string().min(1).max(100),
    phone: z.string().min(1),
    email: z.string().email(),
    deliveryAddress: z.string().min(1).max(500),
    cityOrTown: z.string().min(1).max(100),
    regionOrArea: z.string().min(1).max(100),
    orderNotes: z.string().max(1000).optional(),
  }),
  items: z.array(z.object({
    product: z.object({
      _id: z.string(),
      name: z.string(),
      slug: z.string(),
      price: z.number(),
      mainImage: z.string().optional(),
    }),
    quantity: z.number().int().positive(),
  })).min(1),
  subtotal: z.number().positive(),
  total: z.number().positive(),
  currency: z.string().optional(),
});

// Payment verification schema
export const paymentVerifySchema = z.object({
  reference: z.string().min(1, "Payment reference is required"),
  orderNumber: z.string().optional(),
});

// Type exports
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type PaymentInitInput = z.infer<typeof paymentInitSchema>;
export type PaymentVerifyInput = z.infer<typeof paymentVerifySchema>;

/**
 * Validate and sanitize input with a given schema
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.errors.map((err) => 
    `${err.path.join(".")}: ${err.message}`
  );
  
  return { success: false, errors };
}