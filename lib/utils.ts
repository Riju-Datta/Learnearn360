import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getXpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function getLevelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getLevelTitle(level: number): string {
  if (level < 5) return "Novice";
  if (level < 10) return "Learner";
  if (level < 20) return "Explorer";
  if (level < 35) return "Builder";
  if (level < 50) return "Expert";
  if (level < 70) return "Master";
  if (level < 90) return "Champion";
  return "Legend";
}

export function getProgressToNextLevel(xp: number): {
  current: number;
  needed: number;
  percent: number;
} {
  const level = getLevelFromXp(xp);
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const current = xp - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;
  const percent = Math.min(Math.round((current / needed) * 100), 100);
  return { current, needed, percent };
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function generateUsername(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 15);
  const suffix = Math.floor(Math.random() * 9999);
  return `${base}${suffix}`;
}

export const HUB_CATEGORIES = [
  { value: "CODING", label: "Coding", icon: "💻", color: "bg-blue-500" },
  { value: "LIBRARY", label: "Library", icon: "📚", color: "bg-purple-500" },
  { value: "STARTUP", label: "Startup Hub", icon: "🚀", color: "bg-orange-500" },
  { value: "FREELANCING", label: "Freelancing", icon: "💼", color: "bg-green-500" },
  { value: "AI", label: "AI Hub", icon: "🤖", color: "bg-pink-500" },
  { value: "CAREER", label: "Career Hub", icon: "🎯", color: "bg-cyan-500" },
  { value: "ACCOUNTABILITY", label: "Accountability", icon: "✅", color: "bg-emerald-500" },
  { value: "MONEY", label: "Money-Making", icon: "💰", color: "bg-yellow-500" },
] as const;

export const XP_REWARDS = {
  account_created: 100,
  post_created: 20,
  comment_created: 5,
  post_liked: 2,
  lesson_complete: 50,
  course_complete: 500,
  daily_checkin: 10,
  goal_completed: 15,
  room_joined: 5,
  badge_earned: 100,
  streak_7: 50,
  streak_30: 200,
  streak_100: 500,
  first_follower: 25,
} as const;
