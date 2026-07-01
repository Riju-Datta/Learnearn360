import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, premiumUsers, dau, mau, totalRooms, totalCourses, totalPosts] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { plan: { in: ["PREMIUM", "LIFETIME"] } } }),
    db.user.count({ where: { lastActiveAt: { gte: today } } }),
    db.user.count({ where: { lastActiveAt: { gte: thirtyDaysAgo } } }),
    db.room.count(),
    db.course.count(),
    db.post.count(),
  ]);

  return NextResponse.json({
    totalUsers, premiumUsers, dau, mau, totalRooms, totalCourses, totalPosts,
    mrr: premiumUsers * 19,
    conversionRate: totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : "0",
  });
}
