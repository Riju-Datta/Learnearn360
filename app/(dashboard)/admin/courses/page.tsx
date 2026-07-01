import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminCoursesClient } from "@/components/admin/admin-courses-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Courses" };

export default async function AdminCoursesPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true, username: true } },
      _count: { select: { lessons: true, enrollments: true } },
    },
  });

  return <AdminCoursesClient courses={courses} />;
}
