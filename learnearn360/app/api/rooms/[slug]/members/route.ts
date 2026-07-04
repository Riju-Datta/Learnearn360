import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const room = await db.room.findUnique({ where: { slug: resolvedParams.slug } });
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = 20;

  const members = await db.roomMember.findMany({
    where: { roomId: room.id },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { joinedAt: "asc" },
    include: {
      user: {
        select: { id: true, name: true, username: true, image: true, xpTotal: true, xpLevel: true, plan: true },
      },
    },
  });

  const hasMore = members.length > limit;
  const items = hasMore ? members.slice(0, -1) : members;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return NextResponse.json({ members: items, nextCursor, hasMore });
}
