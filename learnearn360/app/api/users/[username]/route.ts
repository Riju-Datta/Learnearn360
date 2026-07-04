import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: { username: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { username: params.username },
    select: {
      id: true, name: true, username: true, image: true,
      xpTotal: true, xpLevel: true, streakCurrent: true, streakLongest: true,
      plan: true, role: true, createdAt: true,
      profile: {
        select: {
          bio: true, headline: true, location: true, websiteUrl: true,
          githubUrl: true, linkedinUrl: true, twitterUrl: true, coverImage: true,
          skills: { select: { name: true, proficiency: true } },
        },
      },
      userBadges: {
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      },
      _count: { select: { followers: true, following: true, posts: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isFollowing = await db.follow.findUnique({
    where: { followerId_followingId: { followerId: session.user.id, followingId: user.id } },
  });

  return NextResponse.json({ ...user, isFollowing: !!isFollowing });
}
