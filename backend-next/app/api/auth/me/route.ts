import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import UserGame from '@/models/UserGame';
import { getAuthUser } from '@/lib/auth';
import { jsonWithCors } from '@/lib/cors';

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return jsonWithCors({ error: 'Non authentifié' }, 401, origin);
    }
    await connectDB();
    const user = await User.findById(authUser._id).lean() as {
      _id: unknown;
      email: string;
      name: string;
      role: string;
      points: number;
      level: number;
    } | null;
    if (!user) return jsonWithCors({ error: 'Utilisateur introuvable' }, 404, origin);
    const game = await UserGame.findOne({ userId: user._id }).lean() as {
      points: number;
      level: number;
      streak: number;
      badges: unknown[];
      progress?: Record<string, number>;
    } | null;
    return jsonWithCors(
      {
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
          points: user.points,
          level: user.level,
        },
        game: game
          ? {
              points: game.points,
              level: game.level,
              streak: game.streak,
              badges: game.badges,
              progress: game.progress || {},
            }
          : null,
      },
      200,
      origin
    );
  } catch (e) {
    console.error(e);
    return jsonWithCors({ error: 'Erreur serveur' }, 500, origin);
  }
}
