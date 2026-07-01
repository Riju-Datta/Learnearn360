import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid-token", req.url));
  }

  const verificationToken = await db.verificationToken.findUnique({ where: { token } });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return NextResponse.redirect(new URL("/login?error=expired-token", req.url));
  }

  await db.$transaction([
    db.user.update({ where: { email: verificationToken.identifier }, data: { emailVerified: new Date() } }),
    db.verificationToken.delete({ where: { token } }),
  ]);

  return NextResponse.redirect(new URL("/login?verified=true", req.url));
}
