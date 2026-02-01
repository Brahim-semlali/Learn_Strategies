import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const quiz = await Quiz.findById(id).lean() as {
      _id: unknown;
      courseId: unknown;
      title: string;
      questions: unknown[];
    } | null;
    if (!quiz) return NextResponse.json({ error: 'Quiz introuvable' }, { status: 404 });
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(body.courseId != null && { courseId: body.courseId }),
          ...(body.title != null && { title: body.title }),
          ...(body.questions != null && { questions: body.questions }),
        },
      },
      { new: true }
    ).lean() as {
      _id: unknown;
      courseId: unknown;
      title: string;
      questions: unknown[];
    } | null;
    if (!quiz) return NextResponse.json({ error: 'Quiz introuvable' }, { status: 404 });
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }
    const { id } = await params;
    await connectDB();
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) return NextResponse.json({ error: 'Quiz introuvable' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
