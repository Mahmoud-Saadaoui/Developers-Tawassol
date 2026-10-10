# Tawassol Client

Interface utilisateur de Tawassol — plateforme Q&R pour développeurs.

## Stack

- React 18 + Vite + TypeScript
- Ant Design v5
- TanStack Query v5 (data fetching)
- React Context (state global)
- React Router v7

## Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'API
cp .env.example .env
# → VITE_API_URL=http://localhost:5000/api

# 3. Lancer en développement
npm run dev
```

→ http://localhost:5173

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement Vite (avec proxy `/api` → `:5000`) |
| `npm run build` | Build de production → `dist/` |
| `npm run preview` | Prévisualiser le build |
| `npm run typecheck` | Vérification TypeScript |

## Structure

```
src/
├─ api/          # Fetch wrappers (http, auth)
├─ components/   # Composants réutilisables (layout, question, profile)
├─ context/      # React Context (Auth, Locale, Theme)
├─ hooks/        # TanStack Query hooks
├─ pages/        # Pages de l'application
└─ utils/        # Fonctions utilitaires
```
