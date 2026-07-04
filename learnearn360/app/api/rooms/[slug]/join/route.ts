import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { XP_REWARDS } from "@/lib/utils";

type Ctx = { params: { slug: string } };

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const room = await db.room.findUnique({ where: { slug: params.slug } });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const existing = await db.roomMember.findUnique({ where: { roomId_userId: { roomId: room.id, userId } } });
  if (existing) return NextResponse.json({ error: "Already a member" }, { status: 400 });

  await db.$transaction([
    db.roomMember.create({ data: { roomId: room.id, userId } }),
    db.room.update({ where: { id: room.id }, data: { memberCount: { increment: 1 } } }),
    db.xPTransaction.create({ data: { userId, amount: XP_REWARDS.room_joined, actionType: "room_joined", referenceId: room.id } }),
    db.user.update({ where: { id: userId }, data: { xpTotal: { increment: XP_REWARDS.room_joined } } }),
  ]);

  return NextResponse.json({ joined: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const room = await db.room.findUnique({ where: { slug: params.slug } });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  await db.$transaction([
    db.roomMember.delete({ where: { roomId_userId: { roomId: room.id, userId } } }),
    db.room.update({ where: { id: room.id }, data: { memberCount: { decrement: 1 } } }),
  ]);

  return NextResponse.json({ left: true });
}
