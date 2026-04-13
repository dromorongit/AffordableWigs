import mongoose from "mongoose";

/**
 * MongoDB Connection Utility
 * This module provides a connection to MongoDB using Mongoose
 * For use in future phases with real database operations
 */

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/affordable-wigs-gh";

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
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
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
  await mongoose.connection.close();
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