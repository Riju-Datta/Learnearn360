import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: { slug: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const course = await db.course.findUnique({ where: { slug: params.slug } });
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    include: { lessonCompletions: { select: { lessonId: true, completedAt: true } } },
  });

  if (!enrollment) return NextResponse.json({ enrolled: false, progress: 0 });

  return NextResponse.json({
    enrolled: true,
    progress: enrollment.progressPercent,
    completedAt: enrollment.completedAt,
    completedLessons: enrollment.lessonCompletions,
    lastLessonId: enrollment.lastLessonId,
  });
}
