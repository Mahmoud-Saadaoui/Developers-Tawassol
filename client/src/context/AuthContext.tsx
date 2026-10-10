import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { http } from '../api/http';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: { url: string };
  profile: {
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

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http<{ user: User }>('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await http<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await http<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setUser(data.user);
  };

  const logout = async () => {
    await http('/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const refreshUser = async () => {
    const data = await http<{ user: User }>('/auth/me');
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
