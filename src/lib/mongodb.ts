import mongoose from "mongoose";

/**
 * MongoDB Connection Utility
 * This module provides a connection to MongoDB using Mongoose
 * Optimized for serverless environments
 */

// Use MONGODB_URI from environment variables - no fallback for production safety
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("⚠️  MONGODB_URI not set - database features will be disabled");
}

// Suppress Mongoose deprecation warnings
// Only run on server to prevent client-side errors
if (typeof window === "undefined") {
  mongoose.set("strict", false);
  mongoose.set("debug", false);
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global type to include mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB database
 * Uses caching to prevent multiple connections in development
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set. Please configure MONGODB_URI.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Serverless-friendly options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Close MongoDB connection
 * Useful for graceful shutdown
 */
export async function closeDB(): Promise<void> {
  if (mongoose.connection.readyState) {
    await mongoose.connection.close();
  }
  cached.conn = null;
  cached.promise = null;
}

/**
 * Get the Mongoose connection instance
 */
export function getConnection(): typeof mongoose {
  return mongoose;
}

export default mongoose;
