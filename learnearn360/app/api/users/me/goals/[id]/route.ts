import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { awardXp, updateStreak } from "@/lib/gamification";
import { XP_REWARDS } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const goal = await db.dailyGoal.findUnique({ where: { id: resolvedParams.id } });
  if (!goal || goal.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { isCompleted } = await req.json();

  const updated = await db.dailyGoal.update({
    where: { id: resolvedParams.id },
    data: { isCompleted, completedAt: isCompleted ? new Date() : null },
  });

  if (isCompleted && !goal.isCompleted) {
    await awardXp(userId, XP_REWARDS.goal_completed, "goal_completed", goal.id);
    await updateStreak(userId);
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goal = await db.dailyGoal.findUnique({ where: { id: resolvedParams.id } });
  if (!goal || goal.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.dailyGoal.delete({ where: { id: resolvedParams.id } });
  return NextResponse.json({ deleted: true });
}
