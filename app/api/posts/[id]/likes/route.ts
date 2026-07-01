import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { XP_REWARDS } from "@/lib/utils";

type Ctx = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const existing = await db.postLike.findUnique({ where: { postId_userId: { postId: post.id, userId } } });
  if (existing) return NextResponse.json({ error: "Already liked" }, { status: 400 });

  await db.$transaction([
    db.postLike.create({ data: { postId: post.id, userId } }),
    db.post.update({ where: { id: post.id }, data: { likeCount: { increment: 1 } } }),
    // Award XP to the post author, not the liker
    ...(post.authorId !== userId
      ? [
          db.xPTransaction.create({ data: { userId: post.authorId, amount: XP_REWARDS.post_liked, actionType: "post_liked", referenceId: post.id } }),
          db.user.update({ where: { id: post.authorId }, data: { xpTotal: { increment: XP_REWARDS.post_liked } } }),
          db.notification.create({
            data: {
              userId: post.authorId,
              actorId: userId,
              type: "POST_LIKED",
              title: "liked your post",
              link: `/rooms/${post.roomId}`,
              referenceId: post.id,
            },
          }),
        ]
      : []),
  ]);

  return NextResponse.json({ liked: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  await db.$transaction([
    db.postLike.delete({ where: { postId_userId: { postId: post.id, userId } } }),
    db.post.update({ where: { id: post.id }, data: { likeCount: { decrement: 1 } } }),
  ]);

  return NextResponse.json({ liked: false });
}
