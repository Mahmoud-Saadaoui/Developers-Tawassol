import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { clearTestDB, connectTestDB, disconnectTestDB } from './helpers/db';

const app = createApp();

const USER = {
  name: 'Asker',
  email: 'asker@tawassol.dev',
  password: 'password123',
};

/** Register a user and return its cookie-persisting agent. */
async function registerAgent(overrides: Partial<typeof USER> = {}) {
  const agent = request.agent(app);
  const payload = { ...USER, ...overrides };
  await agent.post('/api/auth/register').send(payload);
  return agent;
}

/** Create a tag and return its id. */
async function createTag(name = 'JavaScript') {
  const res = await request(app).post('/api/tags').send({ name });
  return res.body._id as string;
}

beforeAll(connectTestDB);
afterAll(disconnectTestDB);
beforeEach(clearTestDB);

describe('POST /api/questions', () => {
  it('requires authentication', async () => {
    const tagId = await createTag();
    const res = await request(app)
      .post('/api/questions')
      .send({
        title: 'How do I test an Express API with Vitest?',
        content: 'I want integration tests on the auth routes without a real database.',
        tags: [tagId],
      });
    expect(res.status).toBe(401);
  });

  it('creates a question, populates relations and bumps the tag count', async () => {
    const agent = await registerAgent();
    const tagId = await createTag();

    const res = await agent.post('/api/questions').send({
      title: 'How do I test an Express API with Vitest?',
      content: 'I want integration tests on the auth routes without a real database.',
      tags: [tagId],
    });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('How do I test an Express API with Vitest?');
    expect(res.body.tags[0]).toMatchObject({ slug: 'javascript' });
    expect(res.body.author.name).toBe(USER.name);

    const tags = await request(app).get('/api/tags');
    expect(tags.body[0].questionsCount).toBe(1);
  });

  it('rejects unknown tags', async () => {
    const agent = await registerAgent();
    const res = await agent.post('/api/questions').send({
      title: 'A valid question title here',
      content: 'A sufficiently long question content body.',
      tags: ['000000000000000000000000'],
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/tags do not exist/i);
  });
});

describe('GET /api/questions', () => {
  it('lists, filters and full-text searches questions', async () => {
    const agent = await registerAgent();
    const tagId = await createTag();

    await agent.post('/api/questions').send({
      title: 'Understanding the zorblax pattern',
      content: 'A long enough content mentioning the zorblax keyword.',
      tags: [tagId],
    });
    await agent.post('/api/questions').send({
      title: 'A different question about testing',
      content: 'Another long enough content without the special keyword.',
      tags: [tagId],
    });

    const all = await request(app).get('/api/questions');
    expect(all.status).toBe(200);
    expect(all.body.total).toBe(2);

    const search = await request(app).get('/api/questions').query({ search: 'zorblax' });
    expect(search.body.total).toBe(1);
    expect(search.body.items[0].title).toMatch(/zorblax/i);

    const noMatch = await request(app)
      .get('/api/questions')
      .query({ search: 'nonexistentterm' });
    expect(noMatch.body.total).toBe(0);

    const byTag = await request(app).get('/api/questions').query({ tag: tagId });
    expect(byTag.body.total).toBe(2);

    const unanswered = await request(app)
      .get('/api/questions')
      .query({ sort: 'unanswered' });
    expect(unanswered.body.total).toBe(2);
  });

  it('increments the view counter on the detail route', async () => {
    const agent = await registerAgent();
    const tagId = await createTag();
    const created = await agent.post('/api/questions').send({
      title: 'A question to be viewed',
      content: 'A long enough content body for the view test.',
      tags: [tagId],
    });

    await request(app).get(`/api/questions/${created.body._id}`);
    const second = await request(app).get(`/api/questions/${created.body._id}`);

    expect(second.status).toBe(200);
    expect(second.body.views).toBe(2);
  });
});

describe('answers', () => {
  async function setupQuestion() {
    const author = await registerAgent();
    const tagId = await createTag();
    const created = await author.post('/api/questions').send({
      title: 'Question that will be answered',
      content: 'A long enough content body to be answered properly.',
      tags: [tagId],
    });
    return { author, questionId: created.body._id as string };
  }

  it('adds an answer and increments answersCount', async () => {
    const { questionId } = await setupQuestion();
    const answerer = await registerAgent({ email: 'answerer@tawassol.dev' });

    const res = await answerer
      .post(`/api/questions/${questionId}/answers`)
      .send({ content: 'Here is a detailed and useful answer.' });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Here is a detailed and useful answer.');

    const question = await request(app).get(`/api/questions/${questionId}`);
    expect(question.body.answersCount).toBe(1);
  });

  it('lets the author update and delete their question', async () => {
    const { author, questionId } = await setupQuestion();

    const updated = await author
      .put(`/api/questions/${questionId}`)
      .send({ content: 'Updated content that is long enough.' });
    expect(updated.status).toBe(200);

    const deleted = await author.delete(`/api/questions/${questionId}`);
    expect(deleted.status).toBe(200);

    const gone = await request(app).get(`/api/questions/${questionId}`);
    expect(gone.status).toBe(404);
  });

  it('forbids another user from editing the question', async () => {
    const { questionId } = await setupQuestion();
    const stranger = await registerAgent({ email: 'stranger@tawassol.dev' });

    const res = await stranger
      .put(`/api/questions/${questionId}`)
      .send({ content: 'Trying to edit someone else content.' });

    expect(res.status).toBe(404);
  });
});
