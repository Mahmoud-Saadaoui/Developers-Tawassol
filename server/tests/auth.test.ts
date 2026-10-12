import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { clearTestDB, connectTestDB, disconnectTestDB } from './helpers/db';

const app = createApp();

const VALID_USER = {
  name: 'Test User',
  email: 'test@tawassol.dev',
  password: 'password123',
};

beforeAll(connectTestDB);
afterAll(disconnectTestDB);
beforeEach(clearTestDB);

describe('POST /api/auth/register', () => {
  it('creates a user, sets an httpOnly cookie and hides the hash', async () => {
    const res = await request(app).post('/api/auth/register').send(VALID_USER);

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({
      name: VALID_USER.name,
      email: VALID_USER.email,
    });
    expect(res.body.user.passwordHash).toBeUndefined();

    const cookies = res.headers['set-cookie'] as unknown as string[];
    expect(cookies?.some((c) => c.startsWith('token='))).toBe(true);
    expect(cookies?.some((c) => c.includes('HttpOnly'))).toBe(true);
  });

  it('rejects a duplicate email', async () => {
    await request(app).post('/api/auth/register').send(VALID_USER);
    const res = await request(app).post('/api/auth/register').send(VALID_USER);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already in use/i);
  });

  it('rejects invalid input with a 400 and field errors', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'not-an-email', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors.fieldErrors).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(VALID_USER);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: VALID_USER.password });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(VALID_USER.email);
  });

  it('rejects a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: 'wrong-password' });

    expect(res.status).toBe(401);
  });
});

describe('session', () => {
  it('exposes /me for an authenticated agent and 401 otherwise', async () => {
    const anonymous = await request(app).get('/api/auth/me');
    expect(anonymous.status).toBe(401);

    const agent = request.agent(app);
    await agent.post('/api/auth/register').send(VALID_USER);

    const me = await agent.get('/api/auth/me');
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(VALID_USER.email);
  });

  it('clears the session on logout', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send(VALID_USER);

    await agent.post('/api/auth/logout');
    const me = await agent.get('/api/auth/me');

    expect(me.status).toBe(401);
  });
});
