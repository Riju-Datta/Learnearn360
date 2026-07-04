import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { awardXp, updateStreak } from "@/lib/gamification";
import { XP_REWARDS } from "@/lib/utils";

type Ctx = { params: { slug: string; lessonId: string } };

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: { lessons: { select: { id: true } } },
  });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: course.id } } });
  if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

  const lesson = await db.lesson.findUnique({ where: { id: params.lessonId } });
  if (!lesson || lesson.courseId !== course.id) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const existing = await db.lessonCompletion.findUnique({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: lesson.id } },
  });
  if (existing) return NextResponse.json({ error: "Already completed" }, { status: 400 });

  await db.lessonCompletion.create({ data: { enrollmentId: enrollment.id, lessonId: lesson.id } });

  const totalCompleted = await db.lessonCompletion.count({ where: { enrollmentId: enrollment.id } });
  const progressPercent = Math.round((totalCompleted / course.lessons.length) * 100);
  const isCourseComplete = progressPercent >= 100;

  await db.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progressPercent,
      lastLessonId: lesson.id,
      completedAt: isCourseComplete ? new Date() : null,
    },
  });

  await awardXp(userId, lesson.xpReward, "lesson_complete", lesson.id);
  await updateStreak(userId);

  if (isCourseComplete) {
    await db.certificate.create({ data: { userId, courseId: course.id } }).catch(() => null);
    await awardXp(userId, XP_REWARDS.course_complete, "course_complete", course.id);
    await db.notification.create({
      data: { userId, type: "COURSE_COMPLETED", title: `Course complete: ${course.title}! 🏆`, body: "Certificate earned!" },
    });
  }

  return NextResponse.json({ progressPercent, isCourseComplete });
}
