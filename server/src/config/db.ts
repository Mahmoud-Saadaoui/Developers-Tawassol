import mongoose from 'mongoose';
import { env } from './env';

/**
 * Cached connection (module-level) so we don't reconnect on every request.
 * In serverless environments you'd cache on globalThis instead.
 */
let conn: mongoose.Connection | null = null;

export async function connectDB(): Promise<mongoose.Connection> {
  if (conn) return conn;

  const instance = await mongoose.connect(env.mongoUri);
  conn = instance.connection;
  return conn;
}
