import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { env } from '../config/env';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  passwordHash: string;
  provider: 'local' | 'google' | 'github' | 'linkedin';
  providerId?: string;
  avatar?: { url: string; publicId: string };
  profile: {
    headline?: string;
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    skills: string[];
    social: {
      youtube?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      instagram?: string;
    };
    experience: Array<{
      title: string;
      company: string;
      location?: string;
      from: Date;
      to?: Date;
      current: boolean;
      description?: string;
    }>;
    education: Array<{
      school: string;
      degree: string;
      fieldofstudy: string;
      from: Date;
      to?: Date;
      current: boolean;
      description?: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, select: false },
    provider: {
      type: String,
      enum: ['local', 'google', 'github', 'linkedin'],
      default: 'local',
    },
    providerId: { type: String },
    avatar: {
      url: { type: String },
      publicId: { type: String },
    },
    profile: {
      headline: { type: String, maxlength: 140 },
      bio: { type: String, maxlength: 2000 },
      location: { type: String },
      website: { type: String },
      github: { type: String },
      skills: [{ type: String, maxlength: 40 }],
      social: {
        youtube: String,
        twitter: String,
        facebook: String,
        linkedin: String,
        instagram: String,
      },
      experience: [
        {
          title: { type: String, required: true },
          company: { type: String, required: true },
          location: String,
          from: { type: Date, required: true },
          to: Date,
          current: { type: Boolean, default: false },
          description: String,
        },
      ],
      education: [
        {
          school: { type: String, required: true },
          degree: { type: String, required: true },
          fieldofstudy: { type: String, required: true },
          from: { type: Date, required: true },
          to: Date,
          current: { type: Boolean, default: false },
          description: String,
        },
      ],
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);

/* ─── Password helpers ─── */

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(
  user: IUser,
  plain: string,
): Promise<boolean> {
  if (!user.passwordHash) return false;
  return bcrypt.compare(plain, user.passwordHash);
}

/* ─── JWT helpers ─── */

export function signToken(userId: string): string {
  return jwt.sign({ id: userId }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): { id: string } {
  return jwt.verify(token, env.jwt.secret) as { id: string };
}

/* ─── Token extraction ─── */

export function getAuthToken(req: {
  cookies?: Record<string, string>;
  headers?: Record<string, string | string[] | undefined>;
}): string | null {
  const cookieToken = req.cookies?.token;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers?.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
}

/* ─── Serialization ─── */

export function toSafeJSON(user: IUser) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    profile: user.profile,
    createdAt: user.createdAt,
  };
}
