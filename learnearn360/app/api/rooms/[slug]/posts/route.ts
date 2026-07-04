import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { XP_REWARDS } from "@/lib/utils";
import { awardXp, updateStreak } from "@/lib/gamification";

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

  const posts = await db.post.findMany({
    where: { roomId: room.id },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      room: { select: { id: true, name: true, slug: true, icon: true } },
      _count: { select: { comments: true, likes: true } },
      likes: { where: { userId: session.user.id }, select: { id: true } },
      savedBy: { where: { userId: session.user.id }, select: { id: true } },
    },
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, -1) : posts;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return NextResponse.json({
    posts: items.map((p) => ({ ...p, isLiked: p.likes.length > 0, isSaved: p.savedBy.length > 0 })),
    nextCursor,
    hasMore,
  });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const room = await db.room.findUnique({ where: { slug: resolvedParams.slug } });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const member = await db.roomMember.findUnique({ where: { roomId_userId: { roomId: room.id, userId } } });
  if (!member) return NextResponse.json({ error: "Must be a member to post" }, { status: 403 });

  const { type = "TEXT", title, body, imageUrl, linkUrl } = await req.json();

  const post = await db.$transaction(async (tx) => {
    const p = await tx.post.create({
      data: { roomId: room.id, authorId: userId, type, title, body, imageUrl, linkUrl },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        room: { select: { id: true, name: true, slug: true, icon: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });
    await tx.room.update({ where: { id: room.id }, data: { postCount: { increment: 1 } } });
    return p;
  });

  await awardXp(userId, XP_REWARDS.post_created, "post_created", post.id);
  await updateStreak(userId);

  return NextResponse.json(post, { status: 201 });
}
