import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LibraryClient } from "@/components/courses/library-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Library" };

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ category?: string; level?: string; search?: string }> }) {
  const params = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const where: any = { isPublished: true };
  if (params.category) where.category = params.category;
  if (params.level) where.level = params.level;
  if (params.search) where.title = { contains: params.search, mode: "insensitive" };

  const [courses, enrollments] = await Promise.all([
    db.course.findMany({
      where,
      orderBy: [{ enrollmentCount: "desc" }],
      include: {
        instructor: { select: { id: true, name: true, username: true, image: true } },
        _count: { select: { lessons: true, enrollments: true } },
      },
    }),
    db.enrollment.findMany({
      where: { userId },
      select: { courseId: true, progressPercent: true },
    }),
  ]);

  const enrollMap = new Map(enrollments.map((e) => [e.courseId, e.progressPercent]));
  const coursesWithProgress = courses.map((c) => ({
    ...c,
    isEnrolled: enrollMap.has(c.id),
    userProgress: enrollMap.get(c.id) || 0,
  }));

  return <LibraryClient courses={coursesWithProgress} userPlan={session!.user.plan} />;
}
