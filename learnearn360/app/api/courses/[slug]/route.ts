import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: { slug: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      instructor: { select: { id: true, name: true, username: true, image: true } },
      lessons: { orderBy: { sortOrder: "asc" } },
      _count: { select: { lessons: true, enrollments: true } },
    },
  });

  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    include: { lessonCompletions: { select: { lessonId: true } } },
  });

  return NextResponse.json({
    ...course,
    isEnrolled: !!enrollment,
    userProgress: enrollment?.progressPercent ?? 0,
    completedLessonIds: enrollment?.lessonCompletions.map((lc) => lc.lessonId) ?? [],
  });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const course = await db.course.findUnique({ where: { slug: params.slug } });
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isInstructor = course.instructorId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isInstructor && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const updated = await db.course.update({ where: { slug: params.slug }, data: body });
  return NextResponse.json(updated);
}
