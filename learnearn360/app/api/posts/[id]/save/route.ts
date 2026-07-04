import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const existing = await db.savedPost.findUnique({ where: { postId_userId: { postId: resolvedParams.id, userId } } });
  if (existing) return NextResponse.json({ error: "Already saved" }, { status: 400 });

  await db.savedPost.create({ data: { postId: resolvedParams.id, userId } });
  return NextResponse.json({ saved: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  await db.savedPost.delete({ where: { postId_userId: { postId: resolvedParams.id, userId } } }).catch(() => null);
  return NextResponse.json({ saved: false });
}
