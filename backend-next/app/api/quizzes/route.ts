import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) {
      return NextResponse.json({ error: 'courseId requis' }, { status: 400 });
    }
    await connectDB();
    const quiz = await Quiz.findOne({ courseId }).lean();
    if (!quiz) return NextResponse.json({ error: 'Quiz introuvable pour ce cours' }, { status: 404 });
    return NextResponse.json({
      id: String(quiz._id),
      courseId: String(quiz.courseId),
      title: quiz.title,
      questions: quiz.questions,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }
    const body = await req.json();
    const { courseId, title, questions = [] } = body;
    if (!courseId || !title) {
      return NextResponse.json({ error: 'courseId et title requis' }, { status: 400 });
    }
    await connectDB();
    const quiz = await Quiz.create({ courseId, title, questions });
    return NextResponse.json({
      id: String(quiz._id),
      courseId: String(quiz.courseId),
      title: quiz.title,
      questions: quiz.questions,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
