import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendStreakReminderEmail } from "@/lib/resend";

/**
 * Sends a streak-reminder email to any user with an active streak (>= 2 days)
 * who has not been active yet today. Intended to be triggered by a scheduled
 * job — e.g. Vercel Cron (see vercel.json) hitting this route once daily in
 * the evening, or an external scheduler (cron-job.org, GitHub Actions, etc.)
 * calling it with the CRON_SECRET bearer token.
 *
 * Protect with a shared secret so this can't be triggered by the public.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Users with an active streak who haven't been active today yet.
  const usersToRemind = await db.user.findMany({
    where: {
      streakCurrent: { gte: 2 },
      OR: [{ lastActiveAt: { lt: today } }, { lastActiveAt: null }],
      bannedAt: null,
    },
    select: { id: true, email: true, name: true, username: true, streakCurrent: true },
    take: 500, // batch limit per run
  });

  let sent = 0;
  const failures: string[] = [];

  for (const user of usersToRemind) {
    try {
      await sendStreakReminderEmail(user.email, user.name || user.username, user.streakCurrent);
      sent++;
    } catch (err) {
      console.error(`Failed to send streak reminder to ${user.email}:`, err);
      failures.push(user.id);
    }
  }

  return NextResponse.json({ totalCandidates: usersToRemind.length, sent, failed: failures.length });
}
