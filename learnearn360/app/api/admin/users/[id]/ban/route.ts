import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Ban: invalidate all sessions and mark account as banned.
  await db.$transaction([
    db.session.deleteMany({ where: { userId: params.id } }),
    db.user.update({ where: { id: params.id }, data: { bannedAt: new Date() } }),
  ]);

  return NextResponse.json({ banned: true });
}
