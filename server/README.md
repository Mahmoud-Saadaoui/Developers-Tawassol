# Tawassol Server

Tawassol REST API — a Q&A platform for developers.

## Stack

- Node.js 20 + Express 4 + TypeScript
- MongoDB + Mongoose 8
- JWT (httpOnly cookie) + Passport (OAuth Google / GitHub)
- Cloudinary (image uploads)
- Zod (validation)
- Tests: Vitest + Supertest + `mongodb-memory-server`

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure the environment
cp .env.example .env
# → MONGO_URI, JWT_SECRET, OAuth, Cloudinary

# 3. (Optional) Load demo data
npm run seed

# 4. Start in development
npm run dev
```

→ http://localhost:5000/api

## Scripts

| Command              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Server with hot-reload (tsx watch)                       |
| `npm run build`      | TypeScript compilation → `dist/`                         |
| `npm start`          | Start the compiled build                                 |
| `npm run typecheck`  | TypeScript check                                         |
| `npm run seed`       | Load demo data                                           |
| `npm test`           | Integration tests (Vitest + Supertest + in-memory Mongo) |
| `npm run test:watch` | Tests in watch mode                                      |
| `npm run lint`       | ESLint                                                   |
| `npm run format`     | Prettier (`--write`)                                     |

## Tests

```bash
npm test
```

`mongodb-memory-server` starts an ephemeral database: no access to the real
database. In CI without access to the Mongo binary, set `TEST_MONGO_URI` to an
existing instance.

## Structure

```
src/
├─ config/       # env, db, passport, cloudinary, seed
├─ controllers/  # Domain business logic (routers included)
├─ middleware/   # requireAuth, validate (Zod), errorHandler
├─ models/       # Mongoose schemas (User, Post, Tag) + JWT helpers
├─ routes/       # Route aggregation + OAuth
├─ services/     # OAuth, Cloudinary
├─ utils/        # ApiError, asyncHandler, cookies
├─ validators/   # Zod schemas (auth, post, profile)
├─ app.ts        # Express app builder (testable)
└─ server.ts     # Entry point
tests/           # Integration tests (Vitest + Supertest)
```

## API

| Route                             | Description                           |
| --------------------------------- | ------------------------------------- |
| `GET /api/health`                 | API status                            |
| `POST /api/auth/register`         | Local sign-up                         |
| `POST /api/auth/login`            | Local login                           |
| `POST /api/auth/logout`           | Logout                                |
| `GET /api/auth/me`                | Current user                          |
| `GET /api/auth/google`            | Google OAuth                          |
| `GET /api/auth/github`            | GitHub OAuth                          |
| `GET /api/questions`              | List (`sort`, `tag`, `search`, pages) |
| `POST /api/questions`             | Create a question                     |
| `GET /api/questions/:id`          | Question detail                       |
| `POST /api/questions/:id/answers` | Add an answer                         |
| `POST /api/votes/:postId`         | Vote (up/down)                        |
| `POST /api/votes/:id/accept`      | Accept an answer                      |
| `GET /api/tags`                   | List tags                             |
| `GET /api/users`                  | Developer directory (`search`)        |
| `PUT /api/users/me/profile`       | Update your profile                   |
| `POST /api/upload/avatar`         | Avatar upload                         |
| `POST /api/upload/image`          | Image upload                          |

## Seed

`npm run seed` wipes the `users`, `tags` and `posts` collections, then inserts a
demo dataset (5 developers, 8 tags, 8 questions, answers, votes, an accepted
answer). Credentials: `amine@tawassol.dev` / `password123`.

## OAuth configuration

| Provider | Configuration URL                                         |
| -------- | --------------------------------------------------------- |
| Google   | [Google Cloud Console](https://console.cloud.google.com/) |
| GitHub   | Settings → Developer settings → OAuth Apps                |

Callbacks point to `${SERVER_URL}/api/auth/<provider>/callback`. Each strategy
is enabled only when its `CLIENT_ID` is set.

## Deployment (Render)

`render.yaml` describes the web service (build `npm ci && npm run build`, start
`npm start`, health check `/api/health`). See the [root README](../README.md)
for the environment variables.
