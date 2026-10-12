# Tawassol · تواصل

**Tawassol (تواصل)** — A community Q&A platform for developers, with developer
profiles, in **AR/EN (RTL)**.

> [!IMPORTANT]
> This repository is a **validation MVP**: the functional journey is complete and
> tested, but a few **hardening** items remain before a real production release.
> See [Known limitations](#known-limitations) and [Deployment](#deployment).

---

## Table of contents

- [Overview](#overview)
- [Stack](#stack)
- [Structure](#structure)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API](#api)
- [Tests](#tests)
- [Code quality](#code-quality)
- [Known limitations](#known-limitations)
- [Deployment](#deployment)

---

## Overview

Tawassol lets developers **ask questions**, **answer**, **vote** and **manage
their developer profile** (skills, experience, education, links). The UI is
bilingual **English / Arabic** with full **RTL** support and a light/dark theme.

### Features (MVP)

- [x] Local authentication (email + password, `httpOnly` cookie + JWT)
- [x] OAuth authentication (Google, GitHub — enabled by key)
- [x] Full developer profile + Cloudinary avatar
- [x] Questions & answers (Markdown), sorting, pagination, tag filter
- [x] Full-text search (`$text`) on questions
- [x] Votes (up/down toggle, optimistic update) + accepted answer
- [x] Tags + filtering
- [x] Developer directory + public profiles with stats
- [x] AR/EN UI (RTL), light/dark theme, responsive
- [x] Backend tests + frontend component tests + Playwright E2E
- [x] Demo seed

---

## Stack

| Layer          | Technologies                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend**   | React 18 + Vite 6 + TypeScript · Ant Design v5 · TanStack Query v5 · React Router v7 · React Context        |
| **Backend**    | Node.js 20 + Express 4 + TypeScript · MongoDB + Mongoose 8 · JWT (httpOnly cookie) · Passport (OAuth) · Zod |
| **Images**     | Cloudinary                                                                                                  |
| **Tests**      | Vitest + Supertest + `mongodb-memory-server` · Testing Library · Playwright                                 |
| **Quality**    | ESLint 9 (flat config) + Prettier                                                                           |
| **Deployment** | Frontend: Vercel · Backend: Render · DB: MongoDB Atlas · Images: Cloudinary                                 |

---

## Structure

```
tawassol/
├─ client/                 # Vite + React + TS SPA (+ unit & E2E tests)
├─ server/                 # Express + TS API (+ integration tests & seed)
└─ README.md               # This file
```

> `client/` and `server/` are **self-contained**: each manages its own
> dependencies (`npm install`) and has its own `.gitignore`. There is no
> `package.json` or `node_modules` at the root.

---

## Quick start

### Prerequisites

- Node.js 20+
- MongoDB (Atlas or local)
- Cloudinary account (optional — required for image uploads)
- Google / GitHub OAuth apps (optional — required for social login)

### Installation

```bash
git clone <repo-url>
cd tawassol

# ── API ──
cd server
cp .env.example .env      # ← fill in MONGO_URI, JWT_SECRET, OAuth, Cloudinary
npm install
npm run seed              # (optional) demo data
npm run dev               # → http://localhost:5000

# ── Client (another terminal) ──
cd ../client
cp .env.example .env      # ← VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # → http://localhost:5173
```

Demo accounts created by `npm run seed`:

| Email                  | Password      |
| ---------------------- | ------------- |
| `amine@tawassol.dev`   | `password123` |
| `sara@tawassol.dev`    | `password123` |
| `youssef@tawassol.dev` | `password123` |
| `lina@tawassol.dev`    | `password123` |
| `omar@tawassol.dev`    | `password123` |

---

## Environment variables

### `server/.env`

| Variable                                             | Description                           |
| ---------------------------------------------------- | ------------------------------------- |
| `NODE_ENV`                                           | `development` / `production`          |
| `PORT`                                               | HTTP port (default `5000`)            |
| `CLIENT_URL`                                         | Frontend URL (CORS + OAuth redirects) |
| `SERVER_URL`                                         | Public API URL (OAuth callback URLs)  |
| `MONGO_URI`                                          | MongoDB connection string             |
| `JWT_SECRET` / `JWT_EXPIRES_IN`                      | JWT secret and lifetime               |
| `SESSION_SECRET`                                     | OAuth session secret (`state`)        |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`          | Google OAuth                          |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`          | GitHub OAuth                          |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Cloudinary                            |

### `client/.env`

| Variable       | Description              |
| -------------- | ------------------------ |
| `VITE_API_URL` | API base URL (`.../api`) |

---

## Scripts

> Each folder has its **own** scripts. There is no root-level script.

### `server/`

| Command              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Server with hot-reload (`tsx watch`)                     |
| `npm run build`      | TypeScript compilation → `dist/`                         |
| `npm start`          | Start the compiled build                                 |
| `npm run typecheck`  | TypeScript check (`tsc --noEmit`)                        |
| `npm run seed`       | Load demo data                                           |
| `npm test`           | Integration tests (Vitest + Supertest + in-memory Mongo) |
| `npm run test:watch` | Tests in watch mode                                      |
| `npm run lint`       | ESLint                                                   |
| `npm run format`     | Prettier (`--write`)                                     |

### `client/`

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Vite dev server (proxy `/api` → `:5000`) |
| `npm run build`      | Production build → `dist/`               |
| `npm run preview`    | Preview the build                        |
| `npm run typecheck`  | TypeScript check                         |
| `npm test`           | Unit/component tests (Vitest + jsdom)    |
| `npm run test:watch` | Tests in watch mode                      |
| `npm run test:e2e`   | E2E tests (Playwright)                   |
| `npm run lint`       | ESLint                                   |
| `npm run format`     | Prettier (`--write`)                     |

---

## API

Base URL: `/api`. Format: JSON. Error shape: `{ "message": string, "errors"?: any }`.

### Auth — `/api/auth`

| Method | Route       | Description           | Auth |
| ------ | ----------- | --------------------- | ---- |
| POST   | `/register` | Local sign-up         | —    |
| POST   | `/login`    | Local login           | —    |
| POST   | `/logout`   | Logout (clear cookie) | —    |
| GET    | `/me`       | Current user          | ✓    |
| GET    | `/google`   | Redirect Google OAuth | —    |
| GET    | `/github`   | Redirect GitHub OAuth | —    |

### Questions & answers — `/api/questions`

| Method | Route          | Description                             | Auth       |
| ------ | -------------- | --------------------------------------- | ---------- |
| GET    | `/`            | List (`page, limit, sort, tag, search`) | —          |
| GET    | `/:id`         | Detail (+ view counter increment)       | —          |
| POST   | `/`            | Create a question                       | ✓          |
| PUT    | `/:id`         | Update                                  | ✓ (author) |
| DELETE | `/:id`         | Delete                                  | ✓ (author) |
| GET    | `/:id/answers` | Answers                                 | —          |
| POST   | `/:id/answers` | Add an answer                           | ✓          |
| PUT    | `/answers/:id` | Update an answer                        | ✓ (author) |
| DELETE | `/answers/:id` | Delete an answer                        | ✓ (author) |

### Votes — `/api/votes`

| Method | Route                 | Description                 | Auth                |
| ------ | --------------------- | --------------------------- | ------------------- |
| POST   | `/:postId`            | Vote (`{ value: 1 \| -1 }`) | ✓                   |
| DELETE | `/:postId`            | Remove your vote            | ✓                   |
| POST   | `/:questionId/accept` | Accept an answer            | ✓ (question author) |

### Tags — `/api/tags`

| Method | Route    | Description                    |
| ------ | -------- | ------------------------------ |
| GET    | `/`      | List tags (+ `questionsCount`) |
| GET    | `/:slug` | Tag detail                     |
| POST   | `/`      | Create a tag                   |

### Users — `/api/users`

| Method | Route            | Description                       | Auth |
| ------ | ---------------- | --------------------------------- | ---- |
| GET    | `/`              | Directory (`page, limit, search`) | —    |
| GET    | `/:id`           | Public profile + stats            | —    |
| GET    | `/:id/questions` | Questions asked by a user         | —    |
| PUT    | `/me/profile`    | Update your profile               | ✓    |

### Upload — `/api/upload`

| Method | Route     | Description                       | Auth |
| ------ | --------- | --------------------------------- | ---- |
| POST   | `/avatar` | Avatar upload (old one destroyed) | ✓    |
| POST   | `/image`  | Generic image upload              | ✓    |

### Health

| Method | Route         | Description |
| ------ | ------------- | ----------- |
| GET    | `/api/health` | API status  |

---

## Tests

### Backend — Vitest + Supertest (in-memory Mongo)

```bash
cd server
npm test
```

The tests spin up a **`mongodb-memory-server`** database (no access to the real
database). In CI without access to the Mongo binary, set `TEST_MONGO_URI` to use
an existing instance.

Coverage: `auth` (register/login/logout/me), `questions` (CRUD, list, `$text`
search, view counter, answers) and `votes` (toggle, switch, removal, accept).

### Frontend — Vitest + Testing Library (jsdom)

```bash
cd client
npm test
```

Coverage: `translate()` (fallback + interpolation), date utilities,
`MarkdownEditor` (write/preview) and `VoteButtons` (vote + login redirect).

### E2E — Playwright

Critical journey: **sign up → ask a question → answer → vote → accept**.

```bash
cd client
npx playwright install chromium   # once

# Prerequisites: API (with a seeded DB) + client running
cd ../server && npm run seed && npm run dev
cd ../client && npm run dev
# then, in another terminal:
cd client && npm run test:e2e
```

`E2E_BASE_URL` lets you target another URL (default `http://localhost:5173`).

---

## Code quality

- **TypeScript `strict: true`** on both sides.
- **ESLint 9** (flat config) + **Prettier**: `npm run lint`, `npm run format`.
- **Zod validation** on all inputs, **centralized error handling**
  (`errorHandler` on the server, `http.ts` on the client).
- Mongo indexes on query fields (`type`, `parent`, `tags`, `author`,
  `createdAt`) + text index `{ title, content }`.
- Bounded pagination (`limit` max 50), targeted `select`/`populate`.

---

## Known limitations

Scope deliberately kept small for v1.0, but worth knowing before a real
production release.

### Out of scope (by design)

- Notifications, private messaging, moderation, advanced search.
- Email verification, forgot password, refresh token / JWT revocation.
- Real-time (WebSocket/SSE).

### To harden (security & robustness)

- **Cross-site cookies**: see the
  [Cookies & domain](#cookies--domain-to-settle-before-going-live) section.
- **No rate limiting** on `/auth/login` and `/auth/register` (brute-force).
- **`POST /api/tags` is unauthenticated**: tag creation is open to everyone.
- **In-memory OAuth session** (`express-session` MemoryStore): fine for a single
  instance, to be replaced with a shared store if the API scales.
- **`npm run seed` wipes the database**: keep it to development (no `NODE_ENV`
  guard).

### To fix (correctness)

- **Editing a question's tags does not recompute `questionsCount`**: tag counters
  can drift.
- **Approximate view counter**: it increments on every load (including
  refetch), not per unique visitor.
- **E2E not run in CI**: no pipeline is provided; Playwright tests are run
  manually.

---

## Deployment

### Frontend — Vercel

`client/vercel.json` configures the Vite build, the `dist` folder and the SPA
rewrite. Variables: `VITE_API_URL=https://<api>/api`.

### Backend — Render

`server/render.yaml` (Render Blueprint) describes the web service:
`npm ci && npm run build` then `npm start`, health check `/api/health`.
Point to the `server/render.yaml` blueprint path and set the secrets
(`MONGO_URI`, `JWT_SECRET`, OAuth, Cloudinary) in the dashboard.

### Database — MongoDB Atlas

Free cluster, IP whitelist (`0.0.0.0/0` in dev), copy the URI into `MONGO_URI`.

### Cookies & domain (to settle before going live)

The auth cookie is set with `secure: true` + `sameSite: 'lax'` in production.
However, `lax` **is not sent on a cross-site request**: with a frontend on
`*.vercel.app` and an API on `*.onrender.com` (distinct domains), the session
would break (the `fetch(..., { credentials: 'include' })` request would not
carry the cookie).

Two options:

1. **Recommended** — use a **shared custom domain** (e.g. `app.example.com` for
   the frontend and `api.example.com` for the API): same site → `lax` is enough.
2. Otherwise, switch the cookie to `sameSite: 'none'` + `secure: true` and add
   a **CSRF protection**.

### After deployment

- Set `CLIENT_URL` (frontend domain) and `SERVER_URL` (API domain).
- Update the OAuth callback URLs on the provider side.
- Make sure the API URL matches the domain chosen above.

---

## Documentation

- [Client documentation](./client/README.md)
- [Server documentation](./server/README.md)
