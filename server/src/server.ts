import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function bootstrap() {
  await connectDB();
  console.log('✓ MongoDB connected');

  createApp().listen(env.port, () => {
    console.log(`✓ Server running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
