import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { XP_REWARDS } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const comments = await db.comment.findMany({
    where: { postId: resolvedParams.id, parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, username: true, image: true } },
          _count: { select: { likes: true } },
        },
      },
      _count: { select: { likes: true } },
      likes: { where: { userId: session.user.id }, select: { id: true } },
    },
  });

  return NextResponse.json(comments.map((c) => ({ ...c, isLiked: c.likes.length > 0 })));
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { body, parentId } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Comment body required" }, { status: 400 });

  const post = await db.post.findUnique({ where: { id: resolvedParams.id } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const comment = await db.$transaction(async (tx) => {
    const c = await tx.comment.create({
      data: { postId: resolvedParams.id, authorId: userId, body, parentId },
      include: { author: { select: { id: true, name: true, username: true, image: true } } },
    });
    await tx.post.update({ where: { id: resolvedParams.id }, data: { commentCount: { increment: 1 } } });
    await tx.xPTransaction.create({ data: { userId, amount: XP_REWARDS.comment_created, actionType: "comment_created", referenceId: c.id } });
    await tx.user.update({ where: { id: userId }, data: { xpTotal: { increment: XP_REWARDS.comment_created } } });

    if (post.authorId !== userId) {
      await tx.notification.create({
        data: {
          userId: post.authorId,
          actorId: userId,
          type: "POST_COMMENTED",
          title: "commented on your post",
          body: body.slice(0, 100),
          referenceId: post.id,
        },
      });
    }
    return c;
  });

  return NextResponse.json(comment, { status: 201 });
}
