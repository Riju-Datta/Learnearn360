import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = 30;

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { actor: { select: { id: true, name: true, username: true, image: true } } },
  });

  const hasMore = notifications.length > limit;
  const items = hasMore ? notifications.slice(0, -1) : notifications;

  return NextResponse.json({ notifications: items, hasMore, nextCursor: hasMore ? items[items.length - 1].id : null });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids } = await req.json();

  if (ids && Array.isArray(ids)) {
    await db.notification.updateMany({ where: { id: { in: ids }, userId: session.user.id }, data: { isRead: true } });
  } else {
    // Mark all as read
    await db.notification.updateMany({ where: { userId: session.user.id, isRead: false }, data: { isRead: true } });
  }

  return NextResponse.json({ updated: true });
}
