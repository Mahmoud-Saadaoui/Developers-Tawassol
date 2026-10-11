# 📘 Tawassol — Plan détaillé du MVP

> **Tawassol (تواصل)** — Plateforme Q&R communautaire pour développeurs, avec profils développeurs, en **AR/EN (RTL)**.
> Date : 2026-10-10 · Version MVP 1.0

---

## 1. Objectifs du MVP

Permettre à un visiteur de :

1. S'**inscrire / se connecter** par email+mot de passe **ou** par **Google / GitHub / LinkedIn** (OAuth).
2. Compléter son **profil développeur** (bio, compétences, expérience, éducation, liens, réseaux sociaux) + **avatar**.
3. **Poser une question** taguée (avec images éventuelles) et **répondre** à des questions.
4. **Voter** (up/down) sur questions et réponses, **accepter** une réponse.
5. Naviguer en **Anglais ou Arabe (RTL)**.

### Hors périmètre (v1.0)
Temps réel (WebSocket/SSE) · messagerie privée · recherche plein texte avancée · notifications · modération · édition riche WYSIWYG (on reste sur Markdown) · tests automatisés (prévus en phase 8).

---

## 2. Stack technique

| Couche | Technologie | Version cible |
|--------|-------------|---------------|
| **Front** | React + Vite + TypeScript | React 19 · Vite 6 · TS 5 |
| UI | **Ant Design v5** + `@ant-design/icons` | v5 |
| Data fetching | **TanStack Query v5** (via `fetch`) | v5 |
| Store global | **React Context** (auth, locale, thème) | — |
| Routing | **React Router v7** | v7 |
| i18n | Dictionnaires JSON + contexte (`Intl`/`dayjs` locales) | — |
| **Back** | Node.js + Express + TypeScript | Node 20 · Express 4 · TS 5 |
| BDD | **MongoDB Atlas** + **Mongoose** | Mongoose 8 |
| Auth | **JWT** (httpOnly cookie) + **Passport** (OAuth) | passport + stratégies |
| Validation | **Zod** | v3 |
| Images | **Cloudinary** | SDK v2 |
| Déploiement | Front : Vercel · Back : Render/Railway · BDD : Atlas · Images : Cloudinary | — |

---

## 3. Structure du projet

> La racine ne contient que `client/`, `server/`, `plan.md` et `README.md`. **Chaque dossier est autonome** : ses propres dépendances (`package.json`, `node_modules`) et son propre `.gitignore`. Aucun outillage partagé à la racine.

```
tawassol/
├─ client/                        # SPA Vite + React + TS
│  ├─ src/
│  │  ├─ api/
│  │  │  ├─ http.ts               # wrapper fetch (credentials, baseURL, erreurs)
│  │  │  ├─ auth.ts               # register/login/logout/me/oauth
│  │  │  ├─ questions.ts          # CRUD questions, réponses, votes
│  │  │  ├─ tags.ts
│  │  │  ├─ users.ts
│  │  │  └─ upload.ts
│  │  ├─ hooks/                   # TanStack Query
│  │  │  ├─ useAuth.ts
│  │  │  ├─ useQuestions.ts · useQuestion.ts
│  │  │  ├─ useAnswers.ts · useVotes.ts
│  │  │  ├─ useTags.ts · useUsers.ts · useUpload.ts
│  │  ├─ context/
│  │  │  ├─ AuthContext.tsx       # user, login, register, logout, oauth
│  │  │  ├─ LocaleContext.tsx     # locale, setLocale, dir, t()
│  │  │  └─ ThemeContext.tsx      # light/dark (antd theme)
│  │  ├─ components/
│  │  │  ├─ layout/               # AppLayout, Navbar, Footer, ProtectedRoute
│  │  │  ├─ question/             # QuestionCard, QuestionList, VoteButtons, TagChip
│  │  │  ├─ profile/              # ProfileHeader, ExperienceList, EducationList
│  │  │  ├─ common/               # MarkdownEditor, Markdown, EmptyState, Spinner
│  │  ├─ pages/
│  │  │  ├─ HomePage.tsx          # liste questions (tri + pagination)
│  │  │  ├─ AskPage.tsx           # poser une question
│  │  │  ├─ QuestionDetailPage.tsx # détail + réponses
│  │  │  ├─ TagsPage.tsx · TagDetailPage.tsx
│  │  │  ├─ UsersPage.tsx · ProfilePage.tsx
│  │  │  ├─ DashboardPage.tsx     # édition profil
│  │  │  ├─ LoginPage.tsx · RegisterPage.tsx
│  │  │  └─ OAuthCallbackPage.tsx
│  │  ├─ i18n/
│  │  │  ├─ en.json · ar.json
│  │  │  ├─ index.ts
│  │  ├─ utils/                   # cn.ts, date.ts
│  │  ├─ App.tsx · main.tsx · vite-env.d.ts
│  ├─ vite.config.ts              # proxy /api → http://localhost:5000
│  ├─ tsconfig.json · package.json
│
└─ server/                        # API Express + TS
   ├─ src/
   │  ├─ config/
   │  │  ├─ db.ts                 # connexion Mongo (cache global)
   │  │  ├─ passport.ts           # stratégies google/github/linkedin
   │  │  └─ cloudinary.ts         # SDK config
   │  ├─ models/
   │  │  ├─ User.ts · Tag.ts · Post.ts
   │  ├─ controllers/
   │  │  ├─ authController.ts
   │  │  ├─ questionController.ts · answerController.ts
   │  │  ├─ voteController.ts · tagController.ts
   │  │  ├─ userController.ts · uploadController.ts
   │  ├─ routes/
   │  │  ├─ index.ts · auth.routes.ts · question.routes.ts
   │  │  ├─ tag.routes.ts · user.routes.ts · upload.routes.ts
   │  ├─ middleware/
   │  │  ├─ requireAuth.ts        # vérifie JWT cookie
   │  │  ├─ validate.ts           # Zod schemas → 400
   │  │  ├─ errorHandler.ts       # erreurs centralisées
   │  ├─ services/
   │  │  ├─ oauthService.ts       # trouve/crée user depuis profil OAuth
   │  │  └─ cloudinaryService.ts  # upload, destroy, signature
   │  ├─ utils/                   # jwt.ts, ApiError.ts, asyncHandler.ts
   │  ├─ app.ts · server.ts
   ├─ .env · .env.example
   ├─ tsconfig.json · package.json
```

---

## 4. Schéma de base de données

### `User`
```ts
{
  name:        { type: String, required: true, trim: true, maxlength: 80 },
  email:       { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, select: false },        // null si OAuth seul
  provider:    { type: String, enum: ['local','google','github','linkedin'], default: 'local' },
  providerId:  { type: String },                          // id chez le provider OAuth
  avatar: {
    url:      { type: String },
    publicId: { type: String },
  },
  profile: {
    headline:  { type: String, maxlength: 140 },
    bio:       { type: String, maxlength: 2000 },
    location:  { type: String },
    website:   { type: String },
    github:    { type: String },
    skills:    [{ type: String, maxlength: 40 }],
    social: { youtube, twitter, facebook, linkedin, instagram: String },
    experience: [{ title, company, location, from, to, current, description }],
    education: [{ school, degree, fieldofstudy, from, to, current, description }],
  },
  createdAt, updatedAt,
}
```

### `Tag`
```ts
{
  name:           { type: String, required: true, trim: true },
  slug:           { type: String, required: true, unique: true, index: true },
  description:    { type: String, maxlength: 300 },
  questionsCount: { type: Number, default: 0 },
}
```

### `Post` (collection unique question/réponse — reprise Next-IO)
```ts
{
  type:      { type: String, enum: ['question','answer'], required: true },
  title:     { type: String, maxlength: 200 },              // questions uniquement
  content:   { type: String, required: true },             // Markdown
  author:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  parent:    { type: Schema.Types.ObjectId, ref: 'Post' },    // réponse → question
  tags:      [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  votes:     [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, value: { type: Number, enum: [-1,1] } }],
  votesTotal:    { type: Number, default: 0 },             // virtual ou champ calculé
  answersCount:  { type: Number, default: 0 },
  views:         { type: Number, default: 0 },
  acceptedAnswer: { type: Schema.Types.ObjectId, ref: 'Post' },
  createdAt, updatedAt,
}
```
Index utiles : `{ parent: 1, createdAt: -1 }`, `{ type:1, createdAt:-1 }`, `{ tags:1 }`, texte `{ title:'text', content:'text' }` (phase 8).

---

## 5. API REST détaillée

Base URL : `/api`. Format : JSON. Erreur type : `{ message: string, errors?: any }`.

### Auth (`/api/auth`)
| Méthode | Route | Description | Body / Param | Auth |
|---------|-------|-------------|--------------|------|
| POST | `/register` | Inscription locale | `{ name, email, password }` | — |
| POST | `/login` | Connexion locale | `{ email, password }` | — |
| POST | `/logout` | Déconnexion (clear cookie) | — | — |
| GET | `/me` | Utilisateur courant | — | ✓ |
| GET | `/google` | Redirect Google OAuth | — | — |
| GET | `/google/callback` | Callback → JWT → redirect client | — | — |
| GET | `/github` | Redirect GitHub OAuth | — | — |
| GET | `/github/callback` | Callback → JWT → redirect client | — | — |
| GET | `/linkedin` | Redirect LinkedIn OAuth | — | — |
| GET | `/linkedin/callback` | Callback → JWT → redirect client | — | — |

**JWT** : signé avec `JWT_SECRET`, envoyé en cookie httpOnly `token` (7 j) + aussi retourné dans le corps pour le stockage mémoire optionnel. `requireAuth` lit le cookie (ou `Authorization: Bearer`).

### Questions & Réponses (`/api/questions`)
| Méthode | Route | Description | Body | Auth |
|---------|-------|-------------|------|------|
| GET | `/` | Liste questions (tri, pagination, filtre tag) | query: `page, limit, sort(newest|votes|unanswered), tag` | — |
| GET | `/:id` | Détail question + auteur + tags | — | — |
| POST | `/` | Créer question | `{ title, content, tags[] }` | ✓ |
| PUT | `/:id` | Modifier question | `{ title, content, tags[] }` | ✓ (auteur) |
| DELETE | `/:id` | Supprimer question | — | ✓ (auteur) |
| GET | `/:id/answers` | Réponses d'une question | — | — |
| POST | `/:id/answers` | Ajouter réponse | `{ content }` | ✓ |
| PUT | `/answers/:id` | Modifier réponse | `{ content }` | ✓ (auteur) |
| DELETE | `/answers/:id` | Supprimer réponse | — | ✓ (auteur) |

### Votes (`/api/votes`)
| Méthode | Route | Description | Body | Auth |
|---------|-------|-------------|------|------|
| POST | `/:postId` | Voter sur question/réponse | `{ value: 1 \| -1 }` (toggle) | ✓ |
| DELETE | `/:postId` | Retirer son vote | — | ✓ |
| POST | `/:questionId/accept` | Accepter une réponse | `{ answerId }` | ✓ (auteur question) |

### Tags (`/api/tags`)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Liste tags (+ questionsCount) |
| GET | `/:slug` | Détail + questions récentes |
| POST | `/` | Créer tag (optionnel en MVP) |

### Utilisateurs & Profil (`/api/users`)
| Méthode | Route | Description | Body | Auth |
|---------|-------|-------------|------|------|
| GET | `/` | Annuaire développeurs | query `page, limit, search` | — |
| GET | `/:id` | Profil public + stats | — | — |
| GET | `/:id/questions` | Questions d'un user | — | — |
| PUT | `/me/profile` | Mettre à jour profil | `profile{...}` | ✓ |

### Upload (`/api/upload`)
| Méthode | Route | Description | Body | Auth |
|---------|-------|-------------|------|------|
| POST | `/avatar` | Upload avatar (avatar actuel détruit) | `FormData: file` | ✓ |
| POST | `/image` | Upload image → renvoie URL | `FormData: file` | ✓ |

---

## 6. Auth & OAuth — flux

```
[Local]                          [OAuth]
POST /register|login              GET /api/auth/:provider
        │                                  │
        ▼                                  ▼
 bcrypt hash                     Passport → provider
        │                                  │
        ▼                                  ▼
 sign JWT ◄──────────────► profil OAuth normalisé
        │                         (oauthService.findOrCreate)
        ▼
 Cookie httpOnly `token`  ──►  GET /api/auth/me  (front)
        │
        ▼
 requireAuth (cookie ou Bearer)
```

**Liaison de comptes** : si un user OAuth se connecte avec un email déjà existant (local), on lie `provider` + `providerId` (et on propose de définir un mot de passe). Sinon on crée le compte.

**Callback OAuth** : après `passport.authenticate` + génération JWT → `res.redirect(\`${CLIENT_URL}/oauth/callback?ok=1\`)`. Le cookie httpOnly est posé par le serveur. Le front appelle `/api/auth/me` pour charger l'utilisateur.

> ⚠️ **LinkedIn** : nécessite un app vérifié au LinkedIn Developer Portal. On livre **Google + GitHub** au MVP ; le code LinkedIn est prêt et s'active dès que les clés sont renseignées dans `.env`.

---

## 7. Cloudinary — intégration

- Config SDK : `cloudinary.config({ cloud_name, api_key, api_secret })`.
- **Upload serveur** via `multer` (memory storage, limite 5 Mo, filtre mimetype image) → `cloudinary.uploader.upload(stream, { folder: 'tawassol/avatars' })`.
- Stockage en BDD : `avatar: { url, publicId }`.
- **Destruction** à la suppression/remplacement : `uploader.destroy(publicId)`.
- `upload.ts` controller valide le type/taille, upload, retourne `{ url }`.
- Variante scalable (phase 8) : **upload direct signé** — le serveur génère `{ signature, timestamp }` et le client uploade directement vers Cloudinary.

---

## 8. Architecture front

### Context (store global)
- **AuthContext** : `user, loading, login, register, logout, refreshUser`. Persiste via `/api/auth/me` au montage.
- **LocaleContext** : `locale ('en'|'ar'), setLocale, dir ('ltr'|'rtl'), t(key, params)`. Persiste dans `localStorage`. Locale par défaut : `en`.
- **ThemeContext** : `mode ('light'|'dark')` → antd `ConfigProvider theme` + Tailwind classes.

### TanStack Query
- `QueryClient` avec `staleTime`, `gcTime`, `retry`.
- Hooks : `useQuestions`, `useQuestion`, `useCreateQuestion`, `useUpdateQuestion`, `useAnswers`, `useCreateAnswer`, `useVote`, `useTags`, `useUsers`, `useProfile`, `useUpload`.
- Mutations avec `invalidateQueries` (ex. après un vote, invalider la question + la liste).
- Optimistic updates pour les votes.

### Routing (React Router)
```
/                     → Home (liste questions)
/ask                  → Poser une question        [auth]
/questions/:id        → Détail + réponses
/tags · /tags/:slug   → Tags
/users · /users/:id   → Annuaire + profil dev
/dashboard            → Mon profil (édition)       [auth]
/login · /register    → Auth
/oauth/callback       → Callback OAuth
```

### i18n & RTL
- `LocaleContext` + dictionnaires `en.json` / `ar.json`, fonction `t()`.
- antd `ConfigProvider locale={ar / en}` + `dir` + `componentSize`.
- HTML `<html dir="rtl" lang="ar">` ajusté à la locale.
- Utiliser les utilitaires logiques CSS (`ms-`, `me-`, `ps-`, `pe-`, `text-start/end`) + antd v5 RTL natif.

---

## 9. Variables d'environnement

### `server/.env`
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://...
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=...  GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...  GITHUB_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=... LINKEDIN_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### `client/.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 10. Sécurité & bonnes pratiques

- **Mots de passe** : bcrypt (cost 12) ou argon2 ; jamais stocké en clair ; `select:false` sur `passwordHash`.
- **JWT** : httpOnly + `sameSite='lax'` + `secure` en prod ; secret en env.
- **OAuth** : états CSRF (`state: true` sur passport), scopes minimaux.
- **Validation** : Zod sur toutes les entrées ; schémas réutilisables côté client (formulaires antd).
- **CORS** : liste blanche `CLIENT_URL`, `credentials: true`.
- **Upload** : validation mimetype (jpeg/png/webp), taille max 5 Mo, jamaire de fichiers exécutables.
- **Requêtes Mongo** : jamais d'injection (Mongoose + Zod), pagination `limit` borné (max 50).
- **Erreurs** : `errorHandler` centralisé ; pas de stack trace en prod.
- **Helpers** : `asyncHandler`, `ApiError`, `http.ts` front avec gestion 401 → logout + redirect login.

---

## 11. Tests (phase 8)

- **Backend** : Vitest + Supertest — tests d'intégration sur routes auth/questions/votes (Mongo mémoire `mongodb-memory-server`).
- **Frontend** : Vitest + Testing Library — composants clés (VoteButtons, MarkdownEditor) + hooks.
- **E2E** : Playwright — parcours critique (register → ask → answer → vote → accept).

---

## 12. Roadmap détaillée

### Phase 0 — Setup & socle (1-2 j)
- [ ] Créer le monorepo `client/` + `server/`, `package.json`, `tsconfig`, `.env`, `.env.example`.
- [ ] Init **Vite** + React + TS + antd + TanStack Query + React Router + Contexts.
- [ ] Init **Express** + TS + Mongoose + `db.ts` (cache global) + `app.ts`/`server.ts`.
- [ ] CORS + proxy Vite (`/api` → `:5000`) + `errorHandler` + `asyncHandler`.
- [ ] Scripts `dev` / `build` / `start` dans **chaque** dossier (`client`, `server`) — pas de `package.json` racine.
- [ ] Lire `.env` (dotenv), `zod` installé des deux côtés.

### Phase 1 — Auth local (2 j)
- [ ] Modèle `User`, `utils/jwt.ts`, `requireAuth`.
- [ ] `authController` : register/login/logout/me + validation Zod.
- [ ] Cookie httpOnly + `GET /me`.
- [ ] Front : `AuthContext`, `LoginPage`, `RegisterPage`, `ProtectedRoute`, `Navbar` (bouton logout).
- [ ] Test : inscription → login → `/me` → route protégée.

### Phase 2 — OAuth Google & GitHub (2 j)
- [ ] `passport.ts` + stratégies (`google`, `github`).
- [ ] `oauthService.findOrCreate` (normalize profil).
- [ ] Callback → JWT → `res.redirect(CLIENT_URL)`.
- [ ] Front : boutons « Continuer avec Google/GitHub », `OAuthCallbackPage`.
- [ ] Liaison de comptes (email existant).
- [ ] **(Optionnel, clés dispo)** : stratégie LinkedIn.

### Phase 3 — Cloudinary (1-2 j)
- [ ] `cloudinary.ts` config + `multer`.
- [ ] `uploadController` : `/avatar`, `/image`, destruction ancienne image.
- [ ] Modèle `User.avatar{url, publicId}`.
- [ ] Front : `useUpload`, composant `AvatarUpload` (antd Upload), aperçu.

### Phase 4 — Cœur Q&R (3-4 j)
- [ ] Modèles `Post` (parent/tags/votes) + `Tag`.
- [ ] `questionController` : create/list/get/update/delete + tri/pagination/filtre tag.
- [ ] `answerController` : add/update/delete + `answersCount`.
- [ ] Front : `useQuestions`, `useQuestion`, `useCreateQuestion`, `MarkdownEditor`/`Markdown`, `QuestionList`, `AskPage`, `QuestionDetailPage`.
- [ ] Vues : liste (Card, tri, pagination), détail + réponses.

### Phase 5 — Engagement (2 j)
- [ ] `voteController` : vote toggle, `votesTotal`, retirer vote.
- [ ] `accept` : réponse acceptée (auteur question).
- [ ] Front : `VoteButtons` (optimistic update), badge « Réponse acceptée ».
- [ ] Tri par score + filtre « sans réponse ».

### Phase 6 — Profils & Tags (2 j)
- [x] `userController` : annuaire, profil public, stats, `PUT /me/profile`.
- [x] `tagController` : liste, détail + questions.
- [x] Front : `ProfilePage`, `UsersPage`, `DashboardPage`, `TagsPage`, `TagDetailPage`.
- [x] Schémas Zod de profil (expérience/éducation/social).

### Phase 7 — i18n AR/EN + RTL + polish UI (2 j)
- [x] `LocaleContext`, dictionnaires `en.json`/`ar.json`, `t()`.
- [x] antd `ConfigProvider` (locale + dir + theme), `<html dir>`.
- [x] Sélecteur de langue dans la Navbar.
- [x] Thème clair/sombre (`ThemeContext`), design system tokens.
- [x] Responsive + états de chargement/erreur/vide.

### Phase 8 — Tests & durcissement (2-3 j)
- [ ] Tests backend (Vitest + Supertest + Mongo mémoire).
- [ ] Tests composants front (Testing Library).
- [ ] E2E Playwright (parcours critique).
- [ ] Recherche texte (index Mongo `$text`) — si retenue.
- [ ] Nettoyage, commentaires JSDoc, README.

### Phase 9 — Déploiement & mise en prod (1-2 j)
- [ ] Seed de démo (users, tags, questions, réponses) + script `seed.ts`.
- [ ] Front : build Vercel (ou Netlify), variable `VITE_API_URL`.
- [ ] Back : Render/Railway + Atlas + Cloudinary, variables d'env.
- [ ] HTTPS, cookies `secure:true`, `sameSite:'lax'`.
- [ ] README complet (setup, scripts, endpoints, screenshots).

---

## 13. Critères d'acceptation du MVP

✅ Inscription locale + Google (+ GitHub)
✅ Connexion/déconnexion, session persistée, `/me`
✅ Profil dev complet + avatar Cloudinary
✅ Poser / lister / voir / modifier / supprimer une question
✅ Répondre / modifier / supprimer
✅ Voter (toggle) + réponse acceptée
✅ Tags + filtrage
✅ Interface AR & EN (RTL) correcte, responsive
✅ Déployé en ligne avec données de démo

---

## 14. Mise en route (commandes)

```bash
# Racine
git init

# Server
cd server && npm install
cp .env.example .env          # remplir MONGO_URI, JWT_SECRET, OAuth, Cloudinary
npm run dev                   # tsx watch src/server.ts  → http://localhost:5000

# Client
cd ../client && npm install
cp .env.example .env
npm run dev                   # → http://localhost:5173

# Mongo Atlas : créer un cluster gratuit, whitelist IP 0.0.0.0/0, copier l'URI.
# OAuth : créer les apps (Google / GitHub / LinkedIn) et coller les clés dans .env.
```

---

## 15. Réutilisation depuis les deux dossiers (référence)

| Source | Réutilisé |
|--------|-----------|
| **Next-IO** | Design du modèle `Post` (parent/tags/votes/pagination), UX Q&R, logique `vote()`, infra `dbConnect`, i18n/RTL |
| **Developers-Tawassol** | Schéma `Profile` (expérience/éducation/social/skills), UX dashboard & annuaire développeurs |

> Le code est **réécrit en TypeScript** sur la nouvelle stack (Vite + antd + TanStack Query + Express + Passport). Les deux dossiers restent intacts comme référence.

---

## 16. Standards de code & bonnes pratiques

> Objectif : un code **lisible par un dev junior → mid-level**, **réutilisable**, **performant** et **sécurisé**.

### 16.1 Lisibilité (junior → mid-level)
- **TypeScript strict** partout (`strict: true`, pas de `any` sauf exception justifiée avec commentaire).
- **Nommage explicite** : `useCreateQuestion`, `QuestionCard`, `requireAuth`, `votesTotal` — pas d'abréviations cryptiques.
- **Fonctions courtes** : une fonction = une responsabilité ; extraire si > ~20 lignes ou si double indentation.
- **Commentaires JSDoc** sur les fonctions utilitaires, les schémas Zod et les services (pas sur le code évident).
- **Structure prévisible** : toujours le même ordre `models → controllers → routes → middleware` côté serveur ; `api → hooks → context → components → pages` côté client.
- **Pas de « magie »** : pas de logique métier cachée dans les composants ; la logique va dans les hooks/services.
- **Fichiers courts** : viser < 200 lignes par fichier ; découper sinon.

### 16.2 Composants réutilisables
- **Principe de responsabilité unique** : un composant = un rôle (ex. `VoteButtons` ne fait que voter).
- **Composants petits** : viser < ~100 lignes ; un composant qui grandit → le décomposer.
- **Props typées** (interfaces TypeScript) avec valeurs par défaut ; pas de props optionnelles non documentées.
- **Composition > configuration** : préférer `children` et les slots à une liste interminable de props.
- **Dossier `components/ui/`** : composants génériques réutilisables (Button, Input, EmptyState, Spinner, Markdown) sans logique métier.
- **Dossiers par domaine** : `components/question/`, `components/profile/`, `components/tag/` — chaque domaine est autonome.
- **Hooks réutilisables** : `useQuestions`, `useVote`, `useUpload` — la logique vit dans les hooks, pas dans les composants.
- **Pas de duplication** : si un pattern apparaît 2 fois → le extraire en composant/hook utilitaire.

### 16.3 Bonnes pratiques
- **ESLint + Prettier** configurés et appliqués (scripts `lint` / `format`).
- **Validation Zod** sur toutes les entrées (front + back) — jamais de confiance côté serveur.
- **Gestion d'erreurs centralisée** : `errorHandler` côté serveur, `http.ts` avec gestion 401 côté client.
- **Helpers** : `asyncHandler`, `ApiError`, `cn()` (classnames) — pas de code répété.
- **Tests** : tests unitaires sur la logique métier (services, hooks) + tests d'intégration sur les routes critiques.
- **Git** : commits atomiques, messages conventionnels (`feat:`, `fix:`, `refactor:`), branches par fonctionnalité.

### 16.4 Performance
- **Backend** :
  - Index Mongo sur les champs de requête fréquents (`type`, `parent`, `tags`, `author`, `createdAt`).
  - Pagination bornée (`limit` max 50) + `select` pour ne récupérer que les champs nécessaires.
  - `populate` ciblé (pas de `populate` imbriqué inutile).
  - Compression (`compression`), `helmet` pour les en-têtes.
- **Frontend** :
  - **TanStack Query** : `staleTime`, `gcTime`, `invalidateQueries` après mutation — pas de refetch inutile.
  - **Optimistic updates** sur les votes (UI instantanée, rollback si erreur).
  - **Lazy loading** des routes (`React.lazy` + `Suspense`) et des images.
  - **Cloudinary** : transformation d'images (`w_auto`, `q_auto`, `f_auto`) pour des URLs optimisées.
  - **Bundle** : tree-shaking antd (import par composant), pas de `import * as antd`.

### 16.5 Sécurité
- **Mots de passe** : bcrypt/argon2, jamais en clair, `select: false` sur le hash.
- **JWT** : cookie httpOnly + `sameSite: 'lax'` + `secure` en prod ; secret en variable d'environnement.
- **OAuth** : `state: true` (anti-CSRF), scopes minimaux, liaison de comptes sécurisée.
- **CORS** : liste blanche stricte (`CLIENT_URL`), `credentials: true`.
- **Uploads** : validation mimetype + taille max (5 Mo), jamais de fichiers exécutables, destruction des anciennes images.
- **Requêtes** : Mongoose + Zod (pas d'injection), pas de `find({ $where })`.
- **En-têtes** : `helmet`, pas de stack trace en production.
- **Dépendances** : `npm audit` régulier, versions épinglées.

### 16.6 Checklist de revue (à appliquer à chaque PR)
- [ ] TypeScript strict, pas de `any` injustifié
- [ ] Composants < ~100 lignes, responsabilité unique
- [ ] Validation Zod sur toutes les entrées
- [ ] Gestion d'erreurs (try/catch, errorHandler, états d'erreur UI)
- [ ] Pas de logique métier dans les composants (→ hooks/services)
- [ ] Index Mongo si nouvelle requête
- [ ] Pas de secret en dur (`.env`)
- [ ] Tests sur la logique critique
- [ ] ESLint/Prettier sans erreur

---

*Plan généré le 2026-10-10 — à valider avant implémentation (basculer en mode Build).*
