import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { awardXp } from "@/lib/gamification";
import { XP_REWARDS } from "@/lib/utils";

type Ctx = { params: Promise<{ username: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const followerId = session.user.id;

  const target = await db.user.findUnique({ where: { username: resolvedParams.username } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.id === followerId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

  const existing = await db.follow.findUnique({ where: { followerId_followingId: { followerId, followingId: target.id } } });
  if (existing) return NextResponse.json({ error: "Already following" }, { status: 400 });

  await db.follow.create({ data: { followerId, followingId: target.id } });

  const followerCount = await db.follow.count({ where: { followingId: target.id } });
  if (followerCount === 1) {
    await awardXp(target.id, XP_REWARDS.first_follower, "first_follower");
  }

  await db.notification.create({
    data: { userId: target.id, actorId: followerId, type: "NEW_FOLLOWER", title: "started following you", link: `/profile/${session.user.username}` },
  });

  return NextResponse.json({ following: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const followerId = session.user.id;

  const target = await db.user.findUnique({ where: { username: resolvedParams.username } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await db.follow.delete({ where: { followerId_followingId: { followerId, followingId: target.id } } }).catch(() => null);
  return NextResponse.json({ following: false });
}
