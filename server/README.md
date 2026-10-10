# Tawassol Server

API REST de Tawassol — plateforme Q&R pour développeurs.

## Stack

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT (cookie httpOnly)
- Passport (OAuth Google / GitHub / LinkedIn)
- Cloudinary (uploads d'images)
- Zod (validation)

## Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# → MONGO_URI, JWT_SECRET, OAuth, Cloudinary

# 3. Lancer en développement
npm run dev
```

→ http://localhost:5000/api

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur avec hot-reload (tsx watch) |
| `npm run build` | Compilation TypeScript → `dist/` |
| `npm start` | Démarrer la version compilée |
| `npm run typecheck` | Vérification TypeScript |
| `npm run seed` | Charger des données de démo |

## Structure

```
src/
├─ config/       # Configuration (env, db, passport)
├─ controllers/  # Logique métier par domaine
├─ middleware/   # Auth, validation, erreurs
├─ models/       # Schémas Mongoose (User, Post, Tag)
├─ routes/       # Définition des routes
├─ services/     # Services (OAuth, Cloudinary)
├─ utils/        # Helpers (JWT, cookies, erreurs)
├─ validators/   # Schémas Zod
├─ app.ts        # Construction de l'app Express
└─ server.ts     # Point d'entrée
```

## API

| Route | Description |
|-------|-------------|
| `GET /api/health` | Vérification de l'état |
| `POST /api/auth/register` | Inscription locale |
| `POST /api/auth/login` | Connexion locale |
| `POST /api/auth/logout` | Déconnexion |
| `GET /api/auth/me` | Utilisateur courant |
| `GET /api/auth/google` | OAuth Google |
| `GET /api/auth/github` | OAuth GitHub |
| `GET /api/auth/linkedin` | OAuth LinkedIn |
| `GET /api/questions` | Liste des questions |
| `POST /api/questions` | Créer une question |
| `GET /api/questions/:id` | Détail d'une question |
| `POST /api/questions/:id/answers` | Ajouter une réponse |
| `POST /api/votes/:postId` | Voter (up/down) |
| `POST /api/upload/avatar` | Upload d'avatar |
| `POST /api/upload/image` | Upload d'image |

## Configuration OAuth

| Provider | URL de configuration |
|----------|---------------------|
| Google | [Google Cloud Console](https://console.cloud.google.com/) |
| GitHub | Settings → Developer settings → OAuth Apps |
| LinkedIn | [LinkedIn Developers](https://www.linkedin.com/developers/) |
