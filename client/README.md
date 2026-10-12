# Tawassol Client

Tawassol user interface — a Q&A platform for developers.

## Stack

- React 18 + Vite 6 + TypeScript
- Ant Design v5 (native RTL, light/dark theme)
- TanStack Query v5 (data fetching + optimistic updates)
- React Context (Auth, Locale, Theme)
- React Router v7
- Tests: Vitest + Testing Library · E2E Playwright

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure the API
cp .env.example .env
# → VITE_API_URL=http://localhost:5000/api

# 3. Start in development
npm run dev
```

→ http://localhost:5173 (proxy `/api` → `http://localhost:5000`)

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Vite dev server (proxy `/api` → `:5000`) |
| `npm run build`      | Production build → `dist/`               |
| `npm run preview`    | Preview the build                        |
| `npm run typecheck`  | TypeScript check                         |
| `npm test`           | Unit/component tests (Vitest + jsdom)    |
| `npm run test:watch` | Tests in watch mode                      |
| `npm run test:e2e`   | E2E tests (Playwright, see below)        |
| `npm run lint`       | ESLint                                   |
| `npm run format`     | Prettier (`--write`)                     |

## Tests

```bash
npm test                            # unit + component
npx playwright install chromium     # once
npm run test:e2e                    # E2E (API + client must be running)
```

## Structure

```
src/
├─ api/          # Fetch wrappers (http, auth, questions, tags, users, votes, upload)
├─ components/   # Reusable components (layout, question, profile, common)
├─ context/      # React Context (Auth, Locale, Theme)
├─ hooks/        # TanStack Query hooks
├─ i18n/         # en.json / ar.json dictionaries + translate()
├─ pages/        # Application pages
├─ test/         # Vitest setup (jsdom stubs)
└─ utils/        # Utility functions (dates)
e2e/             # Playwright tests (critical journey)
```

## Deployment (Vercel)

`vercel.json` configures the build (`npm run build`), the `dist` folder and the
SPA rewrite. Set `VITE_API_URL` to the deployed API URL.
