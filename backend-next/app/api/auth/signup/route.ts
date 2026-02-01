import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import UserGame from '@/models/UserGame';
import { signToken } from '@/lib/auth';
import { jsonWithCors } from '@/lib/cors';

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, name } = body;
    const emailStr = email ? String(email).trim().toLowerCase() : '';
    if (!emailStr || !password || !name) {
      return jsonWithCors({ error: 'Email, mot de passe et nom requis' }, 400, origin);
    }
    await connectDB();
    const existing = await User.findOne({ email: emailStr });
    if (existing) {
      return jsonWithCors({ error: 'Un compte existe déjà avec cet email' }, 400, origin);
    }
    const user = await User.create({
      email: emailStr,
      password: String(password),
      name: String(name).trim(),
      role: 'user',
      points: 0,
      level: 1,
    });
    await UserGame.create({
      userId: user._id,
      points: 0,
      level: 1,
      streak: 0,
      badges: [
        { id: 'first-steps', name: 'Premiers Pas', description: 'Complétez votre première leçon', icon: '🎯', unlocked: false },
        { id: 'quiz-master', name: 'Maître du Quiz', description: 'Réussissez 10 quiz', icon: '🏆', unlocked: false },
        { id: 'perfectionist', name: 'Perfectionniste', description: 'Obtenez un score parfait', icon: '⭐', unlocked: false },
        { id: 'strategist', name: 'Stratège', description: 'Maîtrisez les 3 stratégies', icon: '🎓', unlocked: false },
        { id: 'streak-5', name: 'Série de 5', description: '5 jours consécutifs', icon: '🔥', unlocked: false },
        { id: 'streak-7', name: 'Semaine Parfaite', description: "7 jours consécutifs d'activité", icon: '🌟', unlocked: false },
        { id: 'streak-10', name: 'Série de 10', description: '10 jours consécutifs', icon: '💫', unlocked: false },
      ],
      progress: {},
    });
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
        points: 0,
        level: 1,
      },
    }, 200, origin);
  } catch (e) {
    console.error(e);
    return jsonWithCors(
      { error: 'Erreur serveur. Vérifiez que MongoDB est connecté et que le backend tourne.' },
      500,
      origin
    );
  }
}
