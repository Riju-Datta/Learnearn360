import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { isPublished } = await req.json();
  const updated = await db.course.update({
    where: { id: params.id },
    data: { isPublished, publishedAt: isPublished ? new Date() : null },
  });
  return NextResponse.json(updated);
}
