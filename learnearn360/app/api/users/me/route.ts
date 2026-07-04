import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { name, headline, bio, location, githubUrl, linkedinUrl, twitterUrl, websiteUrl, skills } = await req.json();

  const updated = await db.$transaction(async (tx) => {
    if (name) await tx.user.update({ where: { id: userId }, data: { name } });

    await tx.profile.upsert({
      where: { userId },
      create: { userId, headline, bio, location, githubUrl, linkedinUrl, twitterUrl, websiteUrl },
      update: { headline, bio, location, githubUrl, linkedinUrl, twitterUrl, websiteUrl },
    });

    if (Array.isArray(skills)) {
      const profile = await tx.profile.findUnique({ where: { userId } });
      if (profile) {
        await tx.profileSkill.deleteMany({ where: { profileId: profile.id } });
        if (skills.length > 0) {
          await tx.profileSkill.createMany({
            data: skills.map((name: string) => ({ profileId: profile.id, name, proficiency: "intermediate" })),
          });
        }
      }
    }

    return tx.user.findUnique({ where: { id: userId }, include: { profile: { include: { skills: true } } } });
  });

  return NextResponse.json(updated);
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { skills: true } } },
  });

  return NextResponse.json(user);
}
