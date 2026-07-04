import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { awardXp, updateStreak } from "@/lib/gamification";
import { XP_REWARDS } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const user = await db.user.findUnique({ where: { id: userId }, select: { lastActiveAt: true } });
  const today = new Date(); today.setHours(0, 0, 0, 0);

  if (user?.lastActiveAt && user.lastActiveAt >= today) {
    return NextResponse.json({ error: "Already checked in today" }, { status: 400 });
  }

  await awardXp(userId, XP_REWARDS.daily_checkin, "daily_checkin");
  const newStreak = await updateStreak(userId);

  return NextResponse.json({ checkedIn: true, streak: newStreak });
}
