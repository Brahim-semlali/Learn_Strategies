import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { jsonWithCors } from '@/lib/cors';

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;
    if (!email || !password) {
      return jsonWithCors({ error: 'Email et mot de passe requis' }, 400, origin);
    }
    await connectDB();
    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password').lean();
    if (!user) {
      return jsonWithCors({ error: 'Email ou mot de passe incorrect' }, 401, origin);
    }
    const match = await bcrypt.compare(String(password), user.password);
    if (!match) {
      return jsonWithCors({ error: 'Email ou mot de passe incorrect' }, 401, origin);
    }
    const token = signToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });
    return jsonWithCors({
      token,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
        points: user.points,
        level: user.level,
      },
    }, 200, origin);
  } catch (e) {
    console.error(e);
    return jsonWithCors({ error: 'Erreur serveur. Vérifiez que MongoDB est connecté.' }, 500, origin);
  }
}
