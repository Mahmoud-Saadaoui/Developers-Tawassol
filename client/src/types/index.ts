export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: { url: string; publicId: string };
  profile?: {
    headline?: string;
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    skills: string[];
    social: Record<string, string>;
    experience: unknown[];
    education: unknown[];
  };
  createdAt: string;
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
  author: User;
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
