import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

/**
 * Test database lifecycle.
 *
 * By default spins up an in-memory MongoDB (`mongodb-memory-server`).
 * Set `TEST_MONGO_URI` to point at a real instance instead (useful in CI where
 * the binary download is not available).
 */
let memoryServer: MongoMemoryServer | null = null;

export async function connectTestDB(): Promise<void> {
  const externalUri = process.env.TEST_MONGO_URI;

  if (externalUri) {
    await mongoose.connect(externalUri);
    return;
  }

  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
}

export async function disconnectTestDB(): Promise<void> {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

/** Remove every document from every collection (keeps indexes intact). */
export async function clearTestDB(): Promise<void> {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})),
  );
}
