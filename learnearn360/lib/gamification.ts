import { db } from "@/lib/db";
import { getLevelFromXp } from "@/lib/utils";

/**
 * Awards XP to a user, updates their level, and triggers badge checks + level-up notification.
 * Call this from any action that grants XP, instead of writing raw transactions everywhere.
 */
export async function awardXp(userId: string, amount: number, actionType: string, referenceId?: string, description?: string) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { xpTotal: true, xpLevel: true } });
  if (!user) return;

  const newXp = user.xpTotal + amount;
  const newLevel = getLevelFromXp(newXp);
  const leveledUp = newLevel > user.xpLevel;

  await db.$transaction([
    db.xPTransaction.create({ data: { userId, amount, actionType, referenceId, description } }),
    db.user.update({ where: { id: userId }, data: { xpTotal: newXp, xpLevel: newLevel } }),
    ...(leveledUp
      ? [
          db.notification.create({
            data: {
              userId,
              type: "LEVEL_UP",
              title: `You reached Level ${newLevel}! 🎉`,
              body: `Keep up the momentum — you're growing fast.`,
            },
          }),
        ]
      : []),
  ]);

  await checkAndAwardBadges(userId);

  return { newXp, newLevel, leveledUp };
}

/**
 * Updates a user's daily streak. Call on any "daily activity" action
 * (post, lesson complete, goal complete, explicit check-in).
 */
export async function updateStreak(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { streakCurrent: true, streakLongest: true, lastActiveAt: true } });
  if (!user) return;

  const now = new Date();
  const last = user.lastActiveAt;
  let newStreak = user.streakCurrent;

  if (!last) {
    newStreak = 1;
  } else {
    const hoursSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 20) {
      // Already counted today, no change
      return;
    } else if (hoursSince <= 48) {
      newStreak = user.streakCurrent + 1;
    } else {
      newStreak = 1; // streak broken, restart
    }
  }

  const newLongest = Math.max(newStreak, user.streakLongest);

  await db.user.update({
    where: { id: userId },
    data: { streakCurrent: newStreak, streakLongest: newLongest, lastActiveAt: now },
  });

  // Streak milestone bonuses
  if (newStreak === 7) await awardXp(userId, 50, "streak_7", undefined, "7-day streak bonus!");
  if (newStreak === 30) await awardXp(userId, 200, "streak_30", undefined, "30-day streak bonus!");
  if (newStreak === 100) await awardXp(userId, 500, "streak_100", undefined, "100-day streak bonus!");

  return newStreak;
}

type BadgeCriteria =
  | { type: "post_count"; value: number }
  | { type: "streak"; value: number }
  | { type: "course_complete_count"; value: number }
  | { type: "follower_count"; value: number }
  | { type: "xp_total"; value: number }
  | { type: "room_join_count"; value: number };

/**
 * Checks all badge criteria against the user's current stats and awards
 * any newly-earned badges. Designed to be called after any XP-earning action.
 */
export async function checkAndAwardBadges(userId: string) {
  const [user, allBadges, earnedBadgeIds] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      include: {
        _count: { select: { posts: true, followers: true, roomMembers: true } },
      },
    }),
    db.badge.findMany(),
    db.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
  ]);

  if (!user) return;

  const earnedSet = new Set(earnedBadgeIds.map((b) => b.badgeId));
  const completedCoursesCount = await db.enrollment.count({ where: { userId, completedAt: { not: null } } });

  const newlyEarned: string[] = [];

  for (const badge of allBadges) {
    if (earnedSet.has(badge.id)) continue;
    const criteria = badge.criteria as unknown as BadgeCriteria;
    let qualifies = false;

    switch (criteria.type) {
      case "post_count":
        qualifies = user._count.posts >= criteria.value;
        break;
      case "streak":
        qualifies = user.streakCurrent >= criteria.value || user.streakLongest >= criteria.value;
        break;
      case "course_complete_count":
        qualifies = completedCoursesCount >= criteria.value;
        break;
      case "follower_count":
        qualifies = user._count.followers >= criteria.value;
        break;
      case "xp_total":
        qualifies = user.xpTotal >= criteria.value;
        break;
      case "room_join_count":
        qualifies = user._count.roomMembers >= criteria.value;
        break;
    }

    if (qualifies) {
      await db.userBadge.create({ data: { userId, badgeId: badge.id } });
      if (badge.xpBonus > 0) {
        await db.user.update({ where: { id: userId }, data: { xpTotal: { increment: badge.xpBonus } } });
      }
      await db.notification.create({
        data: {
          userId,
          type: "BADGE_EARNED",
          title: `New badge earned: ${badge.name}! ${badge.icon}`,
          body: badge.description,
        },
      });
      newlyEarned.push(badge.id);
    }
  }

  return newlyEarned;
}
