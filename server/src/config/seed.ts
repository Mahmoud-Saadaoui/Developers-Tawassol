import mongoose from 'mongoose';
import { Post } from '../models/Post';
import { Tag } from '../models/Tag';
import { hashPassword, User } from '../models/User';
import { connectDB } from './db';

/**
 * Demo data seeder (`npm run seed`).
 *
 * Wipes the `users`, `tags` and `posts` collections, then inserts a small but
 * realistic dataset: developers, tags, questions, answers, votes and one
 * accepted answer — enough to browse every screen of the MVP.
 *
 * Run with `npm run seed` from `server/`. Requires `MONGO_URI` in `.env`.
 */

const DEMO_PASSWORD = 'password123';

interface SeedTag {
  name: string;
  slug: string;
  description: string;
}

interface SeedUser {
  name: string;
  email: string;
  headline: string;
  location: string;
  bio: string;
  github: string;
  skills: string[];
}

interface SeedAnswer {
  author: string; // email
  content: string;
  votes: number; // number of upvotes
  accepted?: boolean;
}

interface SeedQuestion {
  author: string; // email
  title: string;
  content: string;
  tags: string[]; // slugs
  votes: number;
  views: number;
  answers: SeedAnswer[];
}

const TAGS: SeedTag[] = [
  {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'Langage et écosystème JavaScript.',
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    description: 'JavaScript typé à grande échelle.',
  },
  { name: 'React', slug: 'react', description: 'Bibliothèque UI pour le web.' },
  { name: 'Node.js', slug: 'nodejs', description: 'JavaScript côté serveur.' },
  {
    name: 'MongoDB',
    slug: 'mongodb',
    description: 'Base de données NoSQL orientée documents.',
  },
  { name: 'CSS', slug: 'css', description: 'Style et mise en page.' },
  { name: 'Python', slug: 'python', description: 'Langage polyvalent.' },
  { name: 'DevOps', slug: 'devops', description: 'CI/CD, Docker, cloud.' },
];

const USERS: SeedUser[] = [
  {
    name: 'Amine Benali',
    email: 'amine@tawassol.dev',
    headline: 'Full-Stack Developer · React & Node',
    location: 'Casablanca, Maroc',
    bio: "Développeur full-stack passionné par l'architecture front et les API propres.",
    github: 'aminebenali',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
  },
  {
    name: 'Sara El Idrissi',
    email: 'sara@tawassol.dev',
    headline: 'Backend Engineer · Node.js',
    location: 'Rabat, Maroc',
    bio: 'J’aime les bases de données bien modélisées et les tests qui dorment bien la nuit.',
    github: 'saraelidrissi',
    skills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
  },
  {
    name: 'Youssef Karim',
    email: 'youssef@tawassol.dev',
    headline: 'Frontend Developer · Design systems',
    location: 'Marrakech, Maroc',
    bio: 'Je construis des interfaces accessibles et bilingues (RTL).',
    github: 'youssefkarim',
    skills: ['React', 'CSS', 'Accessibility', 'Ant Design'],
  },
  {
    name: 'Lina Haddad',
    email: 'lina@tawassol.dev',
    headline: 'Data & Python Developer',
    location: 'Tunis, Tunisie',
    bio: 'Python, automatisation et pipelines de données.',
    github: 'linahaddad',
    skills: ['Python', 'Pandas', 'FastAPI'],
  },
  {
    name: 'Omar Cherkaoui',
    email: 'omar@tawassol.dev',
    headline: 'DevOps Engineer',
    location: 'Dakar, Sénégal',
    bio: 'CI/CD, Kubernetes et observabilité.',
    github: 'omarcherkaoui',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
  },
];

const QUESTIONS: SeedQuestion[] = [
  {
    author: 'amine@tawassol.dev',
    title: 'Comment gérer proprement les cookies httpOnly avec React et Express ?',
    content:
      "J'utilise un JWT stocké dans un cookie `httpOnly` posé par Express.\n\n" +
      'Quelle est la bonne façon de le lire côté client sans exposer le token en JavaScript ? ' +
      'Faut-il appeler `/auth/me` au montage de l’application ?',
    tags: ['javascript', 'react', 'nodejs'],
    votes: 12,
    views: 340,
    answers: [
      {
        author: 'sara@tawassol.dev',
        content:
          "Oui : le cookie `httpOnly` n'est **pas lisible** en JS, et c'est le but. " +
          'Tu appelles `GET /api/auth/me` au montage, avec `credentials: "include"`, et ' +
          'tu en déduis l’état de session. Un event global sur les 401 permet de faire le logout.',
        votes: 9,
        accepted: true,
      },
      {
        author: 'youssef@tawassol.dev',
        content:
          'Pense aussi à `sameSite: "lax"` en dev et `secure: true` en production. ' +
          'Ça évite les mauvaises surprises au déploiement.',
        votes: 4,
      },
    ],
  },
  {
    author: 'sara@tawassol.dev',
    title:
      'Mongoose : comment modéliser questions et réponses dans une seule collection ?',
    content:
      'Pour un clone de Stack Overflow, vaut-il mieux une collection `posts` avec un champ ' +
      '`type: "question" | "answer"` et un `parent`, ou deux collections séparées ?',
    tags: ['mongodb', 'nodejs'],
    votes: 8,
    views: 210,
    answers: [
      {
        author: 'amine@tawassol.dev',
        content:
          'Une seule collection simplifie les votes et le comptage. Ajoute un index `{ parent: 1, createdAt: -1 }` ' +
          'et `{ type: 1, createdAt: -1 }` pour garder les requêtes rapides.',
        votes: 6,
        accepted: true,
      },
    ],
  },
  {
    author: 'youssef@tawassol.dev',
    title: 'RTL avec Ant Design v5 : les bonnes pratiques ?',
    content:
      'Je veux une interface AR/EN avec bascule RTL. Suffit-il de passer `direction="rtl"` ' +
      'au `ConfigProvider` et `dir="rtl"` sur `<html>` ?',
    tags: ['react', 'css'],
    votes: 15,
    views: 480,
    answers: [
      {
        author: 'amine@tawassol.dev',
        content:
          'Oui, et utilise les utilitaires logiques (`ms-`, `me-`, `ps-`, `pe-`, `text-start`) ' +
          'plutôt que `margin-left`. Ant Design v5 gère le RTL nativement via `direction`.',
        votes: 11,
        accepted: true,
      },
      {
        author: 'sara@tawassol.dev',
        content:
          'Et n’oublie pas la locale `ar_EG` pour les composants antd (dates, pagination).',
        votes: 3,
      },
    ],
  },
  {
    author: 'lina@tawassol.dev',
    title: 'FastAPI vs Express pour une API de données en 2026 ?',
    content:
      'Je démarre un petit service de données. Quels sont les compromis entre FastAPI et Express ' +
      'en termes de typage, performance et écosystème ?',
    tags: ['python', 'nodejs'],
    votes: 5,
    views: 150,
    answers: [],
  },
  {
    author: 'omar@tawassol.dev',
    title: 'Quel pipeline CI/CD minimal pour un monorepo client/server ?',
    content:
      'Je veux déployer le front sur Vercel et le back sur Render, avec des tests automatiques ' +
      'sur chaque PR. Quelle structure de workflow GitHub Actions recommandez-vous ?',
    tags: ['devops'],
    votes: 7,
    views: 175,
    answers: [
      {
        author: 'sara@tawassol.dev',
        content:
          'Un workflow par dossier (`client`, `server`) avec `paths` filters. Sur le back : `npm ci`, ' +
          '`npm run typecheck`, `npm test`. Sur le front : `npm run build`. Vercel/Render prennent le relais.',
        votes: 5,
        accepted: true,
      },
    ],
  },
  {
    author: 'amine@tawassol.dev',
    title:
      'Comment implémenter des votes avec optimistic update dans TanStack Query v5 ?',
    content:
      'Je veux que le score d’une question se mette à jour instantanément au clic, puis revienne ' +
      'en arrière si l’API échoue. Quelle est la structure `onMutate` / `onError` / `onSettled` ?',
    tags: ['react', 'typescript'],
    votes: 20,
    views: 620,
    answers: [
      {
        author: 'youssef@tawassol.dev',
        content:
          'Dans `onMutate` : `cancelQueries`, snapshot des données via `getQueriesData`, puis `setQueryData` ' +
          'optimiste. `onError` restaure les snapshots. `onSettled` invalide pour resynchroniser.',
        votes: 14,
        accepted: true,
      },
    ],
  },
  {
    author: 'sara@tawassol.dev',
    title:
      'MongoDB : index texte ($text) ou recherche regex pour un moteur de recherche simple ?',
    content:
      'Pour rechercher dans le titre et le contenu des questions, `$text` est-il préférable à une ' +
      'regex insensible à la casse ?',
    tags: ['mongodb'],
    votes: 6,
    views: 190,
    answers: [
      {
        author: 'amine@tawassol.dev',
        content:
          '`$text` avec un index `{ title: "text", content: "text" }` est nettement plus efficace et gère ' +
          'le stemming. La regex ne peut pas utiliser l’index et fait un scan complet.',
        votes: 8,
        accepted: true,
      },
    ],
  },
  {
    author: 'lina@tawassol.dev',
    title: 'Comment tester une API Express avec Vitest et Supertest ?',
    content:
      'Je veux des tests d’intégration sur les routes auth sans toucher à la base réelle. ' +
      'Comment brancher `mongodb-memory-server` ?',
    tags: ['nodejs', 'typescript'],
    votes: 9,
    views: 260,
    answers: [],
  },
];

/** Deterministically shuffle-less way to build distinct voter ids per count. */
function buildVotes(voterIds: mongoose.Types.ObjectId[], count: number) {
  return voterIds.slice(0, count).map((user) => ({ user, value: 1 }));
}

async function seed() {
  await connectDB();
  console.log('✓ Connected to MongoDB');

  await Promise.all([Post.deleteMany({}), Tag.deleteMany({}), User.deleteMany({})]);
  console.log('✓ Cleared users, tags, posts');

  // ── Tags ──
  const tags = await Tag.insertMany(TAGS);
  const tagBySlug = new Map(tags.map((t) => [t.slug, t]));
  console.log(`✓ Inserted ${tags.length} tags`);

  // ── Users ──
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const users = await User.insertMany(
    USERS.map((u) => ({
      name: u.name,
      email: u.email,
      passwordHash,
      provider: 'local',
      profile: {
        headline: u.headline,
        bio: u.bio,
        location: u.location,
        github: u.github,
        skills: u.skills,
        social: {},
        experience: [],
        education: [],
      },
    })),
  );
  const userByEmail = new Map(users.map((u) => [u.email, u]));
  const voterPool = users.map((u) => u._id);
  console.log(`✓ Inserted ${users.length} users (password: ${DEMO_PASSWORD})`);

  // ── Questions, answers & votes ──
  let questionCount = 0;
  let answerCount = 0;

  for (const q of QUESTIONS) {
    const author = userByEmail.get(q.author);
    if (!author) continue;

    const questionTags = q.tags
      .map((slug) => tagBySlug.get(slug)?._id)
      .filter((id): id is mongoose.Types.ObjectId => Boolean(id));

    const question = await Post.create({
      type: 'question',
      title: q.title,
      content: q.content,
      author: author._id,
      tags: questionTags,
      votes: buildVotes(voterPool, q.votes),
      votesTotal: q.votes,
      views: q.views,
      answersCount: q.answers.length,
    });
    questionCount += 1;

    let acceptedId: mongoose.Types.ObjectId | undefined;

    for (const a of q.answers) {
      const answerAuthor = userByEmail.get(a.author);
      if (!answerAuthor) continue;

      const answer = await Post.create({
        type: 'answer',
        content: a.content,
        author: answerAuthor._id,
        parent: question._id,
        votes: buildVotes(voterPool, a.votes),
        votesTotal: a.votes,
      });
      answerCount += 1;

      if (a.accepted) acceptedId = answer._id;
    }

    if (acceptedId) {
      question.acceptedAnswer = acceptedId;
      await question.save();
    }
  }

  console.log(`✓ Inserted ${questionCount} questions and ${answerCount} answers`);

  // ── Recompute tag question counts ──
  const counts = await Post.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
    { $match: { type: 'question' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
  ]);

  await Promise.all(
    tags.map((tag) =>
      Tag.updateOne(
        { _id: tag._id },
        { questionsCount: counts.find((c) => c._id.equals(tag._id))?.count ?? 0 },
      ),
    ),
  );

  console.log('✓ Recalculated tag question counts');
  console.log('\n🎉 Seed complete!');
  console.log('   Demo login → amine@tawassol.dev / password123');
}

seed()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Seed failed:', err);
    await mongoose.disconnect().catch(() => undefined);
    process.exit(1);
  });
