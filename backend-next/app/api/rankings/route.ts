import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { jsonWithCors } from '@/lib/cors';

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    await connectDB();
    const users = await User.find({})
      .select('name email points level')
      .sort({ points: -1 })
      .limit(100)
      .lean();

    const leaderboard = users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      points: u.points ?? 0,
      level: u.level ?? 1,
    }));

    return jsonWithCors({ leaderboard }, 200, origin);
  } catch (e) {
    console.error(e);
    return jsonWithCors({ error: 'Erreur serveur' }, 500, origin);
  }
}
