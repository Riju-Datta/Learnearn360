import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const goals = await db.dailyGoal.findMany({
    where: { userId: session.user.id, date: { gte: startOfDay } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { goalText } = await req.json();
  if (!goalText?.trim()) return NextResponse.json({ error: "Goal text required" }, { status: 400 });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const count = await db.dailyGoal.count({ where: { userId: session.user.id, date: { gte: startOfDay } } });
  if (count >= 5) return NextResponse.json({ error: "Max 5 goals per day" }, { status: 400 });

  const goal = await db.dailyGoal.create({
    data: { userId: session.user.id, goalText, date: new Date() },
  });

  return NextResponse.json(goal, { status: 201 });
}
