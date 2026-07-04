import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const roomSlug = searchParams.get("room");
  const limit = Number(searchParams.get("limit")) || 50;

  if (roomSlug) {
    const room = await db.room.findUnique({ where: { slug: roomSlug } });
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const members = await db.roomMember.findMany({
      where: { roomId: room.id },
      take: limit,
      include: { user: { select: { id: true, name: true, username: true, image: true, xpTotal: true, xpLevel: true } } },
      orderBy: { user: { xpTotal: "desc" } },
    });

    return NextResponse.json(members.map((m) => m.user));
  }

  const users = await db.user.findMany({
    orderBy: { xpTotal: "desc" },
    take: limit,
    select: { id: true, name: true, username: true, image: true, xpTotal: true, xpLevel: true, streakCurrent: true, plan: true },
  });

  return NextResponse.json(users);
}
