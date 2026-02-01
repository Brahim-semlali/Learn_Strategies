import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    await connectDB();
    if (courseId) {
      const progress = await UserProgress.findOne({
        userId: authUser._id,
        courseId,
      }).lean();
      return NextResponse.json(
        progress
          ? {
              completedSections: progress.completedSections,
              progressPercent: progress.progressPercent,
            }
          : { completedSections: [], progressPercent: 0 }
      );
    }
    const all = await UserProgress.find({ userId: authUser._id }).lean();
    const byCourse: Record<string, { completedSections: number[]; progressPercent: number }> = {};
    for (const p of all) {
      byCourse[String(p.courseId)] = {
        completedSections: p.completedSections,
        progressPercent: p.progressPercent,
      };
    }
    return NextResponse.json(byCourse);
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
    const { courseId, completedSections, progressPercent } = body;
    if (!courseId) return NextResponse.json({ error: 'courseId requis' }, { status: 400 });
    await connectDB();
    const progress = await UserProgress.findOneAndUpdate(
      { userId: authUser._id, courseId },
      {
        $set: {
          completedSections: completedSections ?? [],
          progressPercent: progressPercent ?? 0,
        },
      },
      { new: true, upsert: true }
    ).lean();
    return NextResponse.json({
      completedSections: progress?.completedSections ?? [],
      progressPercent: progress?.progressPercent ?? 0,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
