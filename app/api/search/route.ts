import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type"); // rooms | courses | users | all

  if (!q || q.length < 2) return NextResponse.json({ rooms: [], courses: [], users: [] });

  const [rooms, courses, users] = await Promise.all([
    !type || type === "all" || type === "rooms"
      ? db.room.findMany({
          where: { name: { contains: q, mode: "insensitive" } },
          take: 5,
          select: { id: true, name: true, slug: true, icon: true, category: true, memberCount: true },
        })
      : [],
    !type || type === "all" || type === "courses"
      ? db.course.findMany({
          where: { title: { contains: q, mode: "insensitive" }, isPublished: true },
          take: 5,
          select: { id: true, title: true, slug: true, thumbnailUrl: true, level: true },
        })
      : [],
    !type || type === "all" || type === "users"
      ? db.user.findMany({
          where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { username: { contains: q, mode: "insensitive" } }] },
          take: 5,
          select: { id: true, name: true, username: true, image: true },
        })
      : [],
  ]);

  return NextResponse.json({ rooms, courses, users });
}
