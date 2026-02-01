import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import UserGame from '@/models/UserGame';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    await connectDB();
    const game = await UserGame.findOne({ userId: authUser._id }).lean();
    if (!game) {
      return NextResponse.json({
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
    }
    return NextResponse.json({
      points: game.points,
      level: game.level,
      streak: game.streak,
      lastActiveDate: game.lastActiveDate,
      badges: game.badges,
      progress: game.progress || {},
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const body = await req.json();
    await connectDB();
    const update: Record<string, unknown> = {};
    if (body.points != null) update.points = body.points;
    if (body.level != null) update.level = body.level;
    if (body.streak != null) update.streak = body.streak;
    if (body.lastActiveDate != null) update.lastActiveDate = body.lastActiveDate;
    if (body.badges != null) update.badges = body.badges;
    if (body.progress != null) update.progress = body.progress;
    const game = await UserGame.findOneAndUpdate(
      { userId: authUser._id },
      { $set: update },
      { new: true, upsert: true }
    ).lean();
    if (body.points != null || body.level != null) {
      await User.findByIdAndUpdate(authUser._id, {
        $set: {
          ...(body.points != null && { points: body.points }),
          ...(body.level != null && { level: body.level }),
        },
      });
    }
    return NextResponse.json({
      points: game?.points ?? 0,
      level: game?.level ?? 1,
      streak: game?.streak ?? 0,
      lastActiveDate: game?.lastActiveDate,
      badges: game?.badges ?? [],
      progress: game?.progress ?? {},
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
