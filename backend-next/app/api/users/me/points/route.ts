import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import UserGame from '@/models/UserGame';
import { getAuthUser } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const body = await req.json();
    const { points } = body;
    if (typeof points !== 'number') {
      return NextResponse.json({ error: 'points (number) requis' }, { status: 400 });
    }
    const level = Math.floor(points / 100) + 1;
    await connectDB();
    await User.findByIdAndUpdate(authUser._id, { $set: { points, level } });
    await UserGame.findOneAndUpdate(
      { userId: authUser._id },
      { $set: { points, level } },
      { upsert: true }
    );
    return NextResponse.json({ points, level });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
