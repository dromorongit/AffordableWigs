import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { IAdmin } from "@/models";

const JWT_SECRET = process.env.JWT_SECRET || "affordable-wigs-gh-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";
const COOKIE_NAME = "admin_token";

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
}

export function generateToken(admin: IAdmin): string {
  const payload: AdminPayload = {
    id: admin._id.toString(),
    email: admin.email,
    name: admin.name,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value || null;
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}