import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const existing = await db.commentLike.findUnique({ where: { commentId_userId: { commentId: params.id, userId } } });
  if (existing) return NextResponse.json({ error: "Already liked" }, { status: 400 });

  await db.$transaction([
    db.commentLike.create({ data: { commentId: params.id, userId } }),
    db.comment.update({ where: { id: params.id }, data: { likeCount: { increment: 1 } } }),
  ]);

  return NextResponse.json({ liked: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  await db.$transaction([
    db.commentLike.delete({ where: { commentId_userId: { commentId: params.id, userId } } }),
    db.comment.update({ where: { id: params.id }, data: { likeCount: { decrement: 1 } } }),
  ]).catch(() => null);

  return NextResponse.json({ liked: false });
}
