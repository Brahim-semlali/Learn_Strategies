import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const course = await Course.findOne({ slug }).lean() as {
      _id: unknown;
      slug: string;
      title: string;
      description: string;
      sections: unknown[];
      order: number;
      color?: string;
      bgColor?: string;
    } | null;
    if (!course) return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
    return NextResponse.json({
      id: String(course._id),
      slug: course.slug,
      title: course.title,
      description: course.description,
      sections: course.sections,
      order: course.order,
      color: course.color,
      bgColor: course.bgColor,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
