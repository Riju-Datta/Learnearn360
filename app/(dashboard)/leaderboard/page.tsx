import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LeaderboardClient } from "@/components/gamification/leaderboard-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [weekly, allTime] = await Promise.all([
    db.user.findMany({
      orderBy: { xpTotal: "desc" },
      take: 50,
      select: { id: true, name: true, username: true, image: true, xpTotal: true, xpLevel: true, streakCurrent: true, plan: true },
    }),
    db.user.findMany({
      orderBy: { xpTotal: "desc" },
      take: 100,
      select: { id: true, name: true, username: true, image: true, xpTotal: true, xpLevel: true, streakCurrent: true, plan: true },
    }),
  ]);

  return <LeaderboardClient weekly={weekly} allTime={allTime} currentUserId={userId} />;
}
