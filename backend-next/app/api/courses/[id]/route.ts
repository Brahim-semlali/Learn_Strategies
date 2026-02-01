import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const course = await Course.findById(id).lean();
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
    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(body.title != null && { title: body.title }),
          ...(body.slug != null && { slug: body.slug }),
          ...(body.description != null && { description: body.description }),
          ...(body.sections != null && { sections: body.sections }),
          ...(body.order != null && { order: body.order }),
          ...(body.color != null && { color: body.color }),
          ...(body.bgColor != null && { bgColor: body.bgColor }),
        },
      },
      { new: true }
    ).lean();
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(_req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }
    const { id } = await params;
    await connectDB();
    const course = await Course.findByIdAndDelete(id);
    if (!course) return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
