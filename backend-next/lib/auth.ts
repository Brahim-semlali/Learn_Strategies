import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { connectDB } from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'strat-quest-secret-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<{ _id: string; email: string; role: string; name: string } | null> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  await connectDB();
  const user = await User.findById(payload.userId).select('_id email role name').lean();
  return user ? { ...user, _id: String(user._id) } : null;
}

export function requireAdmin(authUser: { role: string } | null): boolean {
  return authUser?.role === 'admin';
}
