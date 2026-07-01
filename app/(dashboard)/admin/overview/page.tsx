import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminOverviewClient } from "@/components/admin/admin-overview-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    premiumUsers,
    newUsersToday,
    totalPosts,
    postsToday,
    totalRooms,
    totalCourses,
    activeSubscriptions,
    recentUsers,
    signupsByDay,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { plan: { in: ["PREMIUM", "LIFETIME"] } } }),
    db.user.count({ where: { createdAt: { gte: today } } }),
    db.post.count(),
    db.post.count({ where: { createdAt: { gte: today } } }),
    db.room.count(),
    db.course.count(),
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 10, select: { id: true, name: true, username: true, email: true, image: true, plan: true, createdAt: true } }),
    db.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
  ]);

  const mrr = premiumUsers * 19; // simplified MRR estimate

  return (
    <AdminOverviewClient
      stats={{ totalUsers, premiumUsers, newUsersToday, totalPosts, postsToday, totalRooms, totalCourses, activeSubscriptions, mrr }}
      recentUsers={recentUsers}
      signupsByDay={signupsByDay.map((d) => ({ date: d.date, count: Number(d.count) }))}
    />
  );
}
