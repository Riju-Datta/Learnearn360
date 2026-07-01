import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const level = searchParams.get("level");
  const search = searchParams.get("search");

  const where: any = { isPublished: true };
  if (category) where.category = category;
  if (level) where.level = level;
  if (search) where.title = { contains: search, mode: "insensitive" };

  const courses = await db.course.findMany({
    where,
    orderBy: { enrollmentCount: "desc" },
    include: {
      instructor: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { lessons: true, enrollments: true } },
    },
  });

  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["CREATOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Only creators can publish courses" }, { status: 403 });
  }

  const { title, description, category, level, price, isPremium, thumbnailUrl } = await req.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  let slug = slugify(title);
  const existing = await db.course.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const course = await db.course.create({
    data: {
      title, slug, description, category, level: level || "BEGINNER",
      price: price || 0, isPremium: !!isPremium, thumbnailUrl,
      instructorId: session.user.id,
      isPublished: false,
    },
  });

  return NextResponse.json(course, { status: 201 });
}
