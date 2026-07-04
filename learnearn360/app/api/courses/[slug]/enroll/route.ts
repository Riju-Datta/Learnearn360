import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const course = await db.course.findUnique({ where: { slug: resolvedParams.slug } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  if (course.isPremium && session.user.plan === "FREE") {
    return NextResponse.json({ error: "Premium subscription required" }, { status: 403 });
  }

  const existing = await db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: course.id } } });
  if (existing) return NextResponse.json({ error: "Already enrolled" }, { status: 400 });

  const enrollment = await db.$transaction(async (tx) => {
    const e = await tx.enrollment.create({ data: { userId, courseId: course.id } });
    await tx.course.update({ where: { id: course.id }, data: { enrollmentCount: { increment: 1 } } });
    return e;
  });

  return NextResponse.json(enrollment, { status: 201 });
}
