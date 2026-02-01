import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ order: 1 }).lean();
    return NextResponse.json(
      courses.map((c) => ({
        id: String(c._id),
        slug: c.slug,
        title: c.title,
        description: c.description,
        sections: c.sections,
        order: c.order,
        color: c.color,
        bgColor: c.bgColor,
      }))
    );
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
    const { title, slug, description, sections = [], order = 0, color, bgColor } = body;
    if (!title || !slug || !description) {
      return NextResponse.json({ error: 'title, slug et description requis' }, { status: 400 });
    }
    await connectDB();
    const course = await Course.create({
      title,
      slug,
      description,
      sections: Array.isArray(sections) ? sections : [],
      order,
      color,
      bgColor,
    });
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
