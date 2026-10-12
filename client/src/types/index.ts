export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  _id?: string;
  school: string;
  degree: string;
  fieldofstudy: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

export interface SocialLinks {
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export interface UserProfile {
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  skills: string[];
  social: SocialLinks;
  experience: Experience[];
  education: Education[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: { url: string; publicId: string };
  profile?: Partial<UserProfile>;
  createdAt: string;
}

/** Public profile page stats (`GET /api/users/:id`). */
export interface UserStats {
  questions: number;
  answers: number;
  votesTotal: number;
  views: number;
  acceptedAnswers: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  questionsCount: number;
}

export interface Post {
  id: string;
  type: 'question' | 'answer';
  title?: string;
  content: string;
  /** `null` when the author account no longer exists (orphaned post). */
  author: User | null;
  parent?: string;
  tags: Tag[];
  votes: Array<{ user: string; value: number }>;
  votesTotal: number;
  answersCount: number;
  views: number;
  acceptedAnswer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
