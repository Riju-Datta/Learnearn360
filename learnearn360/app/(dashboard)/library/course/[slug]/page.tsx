import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CourseDetailClient } from "@/components/courses/course-detail-client";
import { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.course.findUnique({ where: { slug } });
  return { title: course?.title || "Course" };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { id: true, name: true, username: true, image: true, profile: { select: { bio: true, headline: true } } } },
      lessons: { orderBy: { sortOrder: "asc" } },
      _count: { select: { lessons: true, enrollments: true } },
    },
  });

  if (!course) notFound();

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
    include: { lessonCompletions: { select: { lessonId: true } } },
  });

  const completedLessonIds = new Set(enrollment?.lessonCompletions.map((lc) => lc.lessonId) || []);

  return (
    <CourseDetailClient
      course={course}
      enrollment={enrollment}
      completedLessonIds={Array.from(completedLessonIds)}
      userPlan={session!.user.plan}
    />
  );
}
