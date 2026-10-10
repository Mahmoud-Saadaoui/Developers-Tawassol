# Tawassol

**Tawassol (تواصل)** — Plateforme Q&R communautaire pour développeurs, avec profils développeurs, en **FR/AR (RTL)**.

## Aperçu

Tawassol permet aux développeurs de poser des questions, répondre, voter et gérer leur profil. L'interface est bilingue français/arabe avec support complet du RTL.

## Stack

| Couche | Technologies |
|--------|-------------|
| **Front** | React 18 + Vite + TypeScript + Ant Design + TanStack Query + React Context |
| **Back** | Node.js + Express + TypeScript + MongoDB + JWT + Passport |
| **Images** | Cloudinary |
| **i18n** | FR / AR (RTL) |

## Démarrage rapide

### Prérequis

- Node.js 20+
- MongoDB Atlas (cluster gratuit)
- Compte Cloudinary (optionnel pour les images)

### Installation

```bash
# 1. Cloner le projet
git clone <repo-url>
cd tawassol

# 2. Installer et lancer le serveur
cd server
cp .env.example .env    # ← remplir MONGO_URI, JWT_SECRET
npm install
npm run dev             # → http://localhost:5000

# 3. Dans un autre terminal, installer et lancer le client
cd ../client
cp .env.example .env    # ← VITE_API_URL=http://localhost:5000/api
npm install
npm run dev             # → http://localhost:5173
```

## Structure du projet

```
tawassol/
├─ client/    # Interface utilisateur (Vite + React)
├─ server/    # API REST (Express + MongoDB)
├─ plan.md    # Architecture détaillée et roadmap
└─ README.md  # Ce fichier
```

## Fonctionnalités

- [x] Authentification locale (email + mot de passe)
- [x] Authentification OAuth (Google, GitHub, LinkedIn)
- [x] Gestion de profil développeur
- [x] Questions et réponses (Markdown)
- [x] Votes et réponses acceptées
- [x] Tags et filtrage
- [x] Upload d'images (Cloudinary)
- [ ] Interface FR/AR (RTL)
- [ ] Déploiement en production

## Documentation

- [Plan détaillé](./plan.md) — architecture, schémas, roadmap
- [Documentation client](./client/README.md)
- [Documentation serveur](./server/README.md)
