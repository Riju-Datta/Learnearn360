import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: any = {};
  if (category) where.category = category;
  if (search) where.name = { contains: search, mode: "insensitive" };

  const rooms = await db.room.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { memberCount: "desc" }],
    include: {
      owner: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { members: true, posts: true } },
    },
  });

  return NextResponse.json(rooms);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, category, type, icon } = await req.json();
  if (!name || !category) return NextResponse.json({ error: "Name and category required" }, { status: 400 });

  let slug = slugify(name);
  const existing = await db.room.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const room = await db.$transaction(async (tx) => {
    const r = await tx.room.create({
      data: {
        name, slug, description, category, type: type || "PUBLIC", icon,
        ownerId: session.user.id, memberCount: 1,
      },
    });
    await tx.roomMember.create({ data: { roomId: r.id, userId: session.user.id, role: "admin" } });
    return r;
  });

  return NextResponse.json(room, { status: 201 });
}
