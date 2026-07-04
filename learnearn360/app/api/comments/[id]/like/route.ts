import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const existing = await db.commentLike.findUnique({ where: { commentId_userId: { commentId: resolvedParams.id, userId } } });
  if (existing) return NextResponse.json({ error: "Already liked" }, { status: 400 });

  await db.$transaction([
    db.commentLike.create({ data: { commentId: resolvedParams.id, userId } }),
    db.comment.update({ where: { id: resolvedParams.id }, data: { likeCount: { increment: 1 } } }),
  ]);

  return NextResponse.json({ liked: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  await db.$transaction([
    db.commentLike.delete({ where: { commentId_userId: { commentId: resolvedParams.id, userId } } }),
    db.comment.update({ where: { id: resolvedParams.id }, data: { likeCount: { decrement: 1 } } }),
  ]).catch(() => null);

  return NextResponse.json({ liked: false });
}
