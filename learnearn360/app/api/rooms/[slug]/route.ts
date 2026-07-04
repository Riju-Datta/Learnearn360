import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const room = await db.room.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      owner: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { members: true, posts: true } },
      members: { where: { userId: session.user.id }, select: { role: true } },
    },
  });

  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  return NextResponse.json({ ...room, isMember: room.members.length > 0, userRole: room.members[0]?.role || null });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const room = await db.room.findUnique({ where: { slug: resolvedParams.slug } });
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = room.ownerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, description, icon, isPremium } = await req.json();
  const updated = await db.room.update({ where: { slug: resolvedParams.slug }, data: { name, description, icon, isPremium } });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const room = await db.room.findUnique({ where: { slug: resolvedParams.slug } });
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = room.ownerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.room.delete({ where: { slug: resolvedParams.slug } });
  return NextResponse.json({ deleted: true });
}
