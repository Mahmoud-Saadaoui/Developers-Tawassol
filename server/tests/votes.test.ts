import request from 'supertest';
import type { SuperAgentTest } from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { clearTestDB, connectTestDB, disconnectTestDB } from './helpers/db';

const app = createApp();

function makeAgent() {
  return request.agent(app);
}

async function register(agent: SuperAgentTest, email: string) {
  await agent
    .post('/api/auth/register')
    .send({ name: email.split('@')[0], email, password: 'password123' });
}

/** Create a tag + a question owned by `agent`, return the question id. */
async function createQuestion(agent: SuperAgentTest): Promise<string> {
  const tag = await request(app).post('/api/tags').send({ name: 'Voting' });
  const res = await agent.post('/api/questions').send({
    title: 'A question used to test the voting flow',
    content: 'A long enough content body to exercise votes.',
    tags: [tag.body._id],
  });
  return res.body._id as string;
}

beforeAll(connectTestDB);
afterAll(disconnectTestDB);
beforeEach(clearTestDB);

describe('POST /api/votes/:postId', () => {
  it('requires authentication', async () => {
    const owner = makeAgent();
    await register(owner, 'owner@tawassol.dev');
    const questionId = await createQuestion(owner);

    const res = await request(app).post(`/api/votes/${questionId}`).send({ value: 1 });
    expect(res.status).toBe(401);
  });

  it('toggles, switches and removes a vote', async () => {
    const owner = makeAgent();
    await register(owner, 'owner@tawassol.dev');
    const questionId = await createQuestion(owner);

    const voter = makeAgent();
    await register(voter, 'voter@tawassol.dev');

    // New upvote
    const up = await voter.post(`/api/votes/${questionId}`).send({ value: 1 });
    expect(up.body.votesTotal).toBe(1);

    // Same value again → toggle off
    const toggled = await voter.post(`/api/votes/${questionId}`).send({ value: 1 });
    expect(toggled.body.votesTotal).toBe(0);

    // Downvote
    const down = await voter.post(`/api/votes/${questionId}`).send({ value: -1 });
    expect(down.body.votesTotal).toBe(-1);

    // Switch down → up (+2)
    const switched = await voter.post(`/api/votes/${questionId}`).send({ value: 1 });
    expect(switched.body.votesTotal).toBe(1);

    // Explicit removal
    const removed = await voter.delete(`/api/votes/${questionId}`);
    expect(removed.body.votesTotal).toBe(0);
  });

  it('rejects an invalid vote value', async () => {
    const owner = makeAgent();
    await register(owner, 'owner@tawassol.dev');
    const questionId = await createQuestion(owner);

    const res = await owner.post(`/api/votes/${questionId}`).send({ value: 2 });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/votes/:questionId/accept', () => {
  async function setup() {
    const owner = makeAgent();
    await register(owner, 'owner@tawassol.dev');
    const questionId = await createQuestion(owner);

    const helper = makeAgent();
    await register(helper, 'helper@tawassol.dev');
    const answer = await helper
      .post(`/api/questions/${questionId}/answers`)
      .send({ content: 'A helpful answer to be accepted.' });

    return { owner, helper, questionId, answerId: answer.body._id as string };
  }

  it('lets the question owner accept an answer', async () => {
    const { owner, questionId, answerId } = await setup();

    const res = await owner.post(`/api/votes/${questionId}/accept`).send({ answerId });
    expect(res.status).toBe(200);

    const question = await request(app).get(`/api/questions/${questionId}`);
    expect(question.body.acceptedAnswer).toBe(answerId);
  });

  it('forbids a non-owner from accepting', async () => {
    const { helper, questionId, answerId } = await setup();

    const res = await helper.post(`/api/votes/${questionId}/accept`).send({ answerId });
    expect(res.status).toBe(404);
  });
});
