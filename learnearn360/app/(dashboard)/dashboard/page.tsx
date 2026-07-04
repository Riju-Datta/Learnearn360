import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [user, rooms, courses, goals, recentPosts] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      include: {
        profile: { include: { skills: true } },
        userBadges: { include: { badge: true }, take: 5, orderBy: { earnedAt: "desc" } },
        _count: { select: { followers: true, following: true, posts: true } },
      },
    }),
    db.room.findMany({
      where: { members: { some: { userId } } },
      take: 4,
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { members: true, posts: true } } },
    }),
    db.enrollment.findMany({
      where: { userId, completedAt: null },
      take: 3,
      orderBy: { updatedAt: "desc" },
      include: { course: { include: { instructor: { select: { name: true, image: true } } } } },
    }),
    db.dailyGoal.findMany({
      where: { userId, date: { gte: new Date(new Date().setHours(0,0,0,0)) } },
      orderBy: { createdAt: "asc" },
    }),
    db.post.findMany({
      where: { room: { members: { some: { userId } } } },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        room: { select: { id: true, name: true, slug: true, icon: true } },
        _count: { select: { comments: true, likes: true } },
        likes: { where: { userId }, select: { id: true } },
      },
    }),
  ]);

  const postsWithLiked = recentPosts.map((p) => ({ ...p, isLiked: p.likes.length > 0 }));

  return <DashboardClient user={user} rooms={rooms} enrollments={courses} goals={goals} posts={postsWithLiked} />;
}
