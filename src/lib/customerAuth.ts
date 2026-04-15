import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { IUser } from "@/models";

const JWT_SECRET = process.env.JWT_SECRET || "affordable-wigs-gh-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";
const CUSTOMER_COOKIE_NAME = "customer_token";

export interface CustomerPayload {
  id: string;
  email: string;
  name: string;
}

/**
 * Generate JWT token for customer
 */
export function generateCustomerToken(user: IUser): string {
  const payload: CustomerPayload = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token for customer
 */
export function verifyCustomerToken(token: string): CustomerPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomerPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Set customer auth cookie (httpOnly, secure)
 */
export async function setCustomerCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Get customer auth cookie
 */
export async function getCustomerCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME);
  return token?.value || null;
}

/**
 * Remove customer auth cookie
 */
export async function removeCustomerCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE_NAME);
}

/**
 * Get current customer from cookie (without DB lookup)
 */
export async function getCurrentCustomer(): Promise<CustomerPayload | null> {
  const token = await getCustomerCookie();
  if (!token) return null;
  return verifyCustomerToken(token);
}

/**
 * Extract token from Authorization header
 */
export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}