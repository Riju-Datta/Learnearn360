import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * One-time database seeding, triggerable from a browser (no CLI required).
 * Protected by a shared secret passed as a query param so it can be safely
 * hit from a phone browser after first deploy: /api/admin/seed?secret=...
 *
 * This mirrors prisma/seed.ts but runs inside the deployed app, which is
 * useful when you have no local terminal (e.g. deploying entirely from
 * a phone via Vercel + Neon).
 *
 * Safe to call multiple times — uses upsert/idempotent checks throughout.
 */

const BADGES = [
  { name: "First Steps", description: "Created your account", icon: "🎉", category: "onboarding", xpBonus: 0, criteria: { type: "xp_total", value: 0 } },
  { name: "First Post", description: "Published your first post", icon: "✍️", category: "community", xpBonus: 25, criteria: { type: "post_count", value: 1 } },
  { name: "Conversationalist", description: "Published 10 posts", icon: "💬", category: "community", xpBonus: 50, criteria: { type: "post_count", value: 10 } },
  { name: "Community Pillar", description: "Published 50 posts", icon: "🏛️", category: "community", xpBonus: 200, criteria: { type: "post_count", value: 50 } },
  { name: "On Fire", description: "Reached a 7-day streak", icon: "🔥", category: "consistency", xpBonus: 50, criteria: { type: "streak", value: 7 } },
  { name: "Unstoppable", description: "Reached a 30-day streak", icon: "⚡", category: "consistency", xpBonus: 200, criteria: { type: "streak", value: 30 } },
  { name: "Legend", description: "Reached a 100-day streak", icon: "👑", category: "consistency", xpBonus: 500, criteria: { type: "streak", value: 100 } },
  { name: "First Certificate", description: "Completed your first course", icon: "📜", category: "learning", xpBonus: 100, criteria: { type: "course_complete_count", value: 1 } },
  { name: "Lifelong Learner", description: "Completed 5 courses", icon: "🎓", category: "learning", xpBonus: 300, criteria: { type: "course_complete_count", value: 5 } },
  { name: "Rising Star", description: "Gained 10 followers", icon: "⭐", category: "social", xpBonus: 50, criteria: { type: "follower_count", value: 10 } },
  { name: "Influencer", description: "Gained 100 followers", icon: "🌟", category: "social", xpBonus: 250, criteria: { type: "follower_count", value: 100 } },
  { name: "Explorer", description: "Joined 5 rooms", icon: "🧭", category: "community", xpBonus: 30, criteria: { type: "room_join_count", value: 5 } },
  { name: "Code Warrior", description: "Reached 5,000 XP", icon: "💻", category: "xp", xpBonus: 0, criteria: { type: "xp_total", value: 5000 } },
  { name: "Master Builder", description: "Reached 25,000 XP", icon: "🏗️", category: "xp", xpBonus: 0, criteria: { type: "xp_total", value: 25000 } },
];

const ROOMS = [
  { name: "JavaScript Daily Challenges", slug: "js-daily-challenges", category: "CODING" as const, icon: "💻", description: "Solve a new JS challenge every day with the community.", isFeatured: true },
  { name: "Python for Beginners", slug: "python-beginners", category: "CODING" as const, icon: "🐍", description: "Just starting with Python? This is your room." },
  { name: "Startup Idea Lab", slug: "startup-idea-lab", category: "STARTUP" as const, icon: "🚀", description: "Validate your startup idea with real feedback.", isFeatured: true },
  { name: "Freelance Wins & Lessons", slug: "freelance-wins", category: "FREELANCING" as const, icon: "💼", description: "Share client wins, proposal tips, and lessons learned." },
  { name: "AI Tools Spotlight", slug: "ai-tools-spotlight", category: "AI" as const, icon: "🤖", description: "Weekly spotlight on the best new AI tools.", isFeatured: true },
  { name: "Resume Review Circle", slug: "resume-review", category: "CAREER" as const, icon: "📋", description: "Get your resume reviewed by the community." },
  { name: "Morning Accountability", slug: "morning-accountability", category: "ACCOUNTABILITY" as const, icon: "🌅", description: "Post your 3 goals every morning. Check in daily." },
  { name: "Side Hustle Ideas", slug: "side-hustle-ideas", category: "MONEY" as const, icon: "💰", description: "Validated side hustle ideas with income potential.", isFeatured: true },
];

const COURSES = [
  {
    title: "Web Development Fundamentals", slug: "web-dev-fundamentals",
    description: "Learn HTML, CSS, and JavaScript from scratch.",
    category: "Coding", level: "BEGINNER" as const, price: 0, isPremium: false,
    lessons: [
      { title: "Welcome & Setup", type: "TEXT" as const, body: "Welcome to Web Development Fundamentals!", sortOrder: 1, isFreePreview: true },
      { title: "HTML Basics", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/UB1O30fR-EE", durationSeconds: 1800, sortOrder: 2, isFreePreview: true },
      { title: "CSS Styling", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc", durationSeconds: 2400, sortOrder: 3 },
    ],
  },
  {
    title: "Freelancing 101: Land Your First Client", slug: "freelancing-101",
    description: "A practical guide to getting your first paying freelance client.",
    category: "Freelancing", level: "BEGINNER" as const, price: 0, isPremium: false,
    lessons: [
      { title: "Choosing Your Niche", type: "TEXT" as const, body: "Your niche should be narrow enough to be memorable, wide enough to find clients.", sortOrder: 1, isFreePreview: true },
      { title: "Building a Portfolio", type: "TEXT" as const, body: "Your portfolio doesn't need 10 projects — it needs 3 great ones.", sortOrder: 2 },
    ],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized. Pass ?secret=YOUR_SEED_SECRET" }, { status: 401 });
  }

  const log: string[] = [];

  // Badges
  for (const badge of BADGES) {
    await db.badge.upsert({ where: { name: badge.name }, create: badge as any, update: badge as any });
  }
  log.push(`✓ ${BADGES.length} badges created`);

  // Admin user
  const password = await bcrypt.hash("Password123", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@learnearn360.com" },
    create: {
      email: "admin@learnearn360.com", username: "admin", name: "Admin User",
      password, role: "ADMIN", plan: "LIFETIME", emailVerified: new Date(), xpTotal: 50000, xpLevel: 23,
      streakCurrent: 45, streakLongest: 90,
      profile: { create: { bio: "Platform administrator.", headline: "LearnEarn 360 Team" } },
    },
    update: {},
  });
  log.push(`✓ Admin user ready (admin@learnearn360.com / Password123)`);

  // Rooms
  let roomCount = 0;
  for (const room of ROOMS) {
    const r = await db.room.upsert({
      where: { slug: room.slug },
      create: { ...room, ownerId: admin.id, memberCount: 1, postCount: 0 },
      update: {},
    });
    await db.roomMember.upsert({
      where: { roomId_userId: { roomId: r.id, userId: admin.id } },
      create: { roomId: r.id, userId: admin.id, role: "admin" },
      update: {},
    });
    roomCount++;
  }
  log.push(`✓ ${roomCount} rooms created`);

  // Courses
  let courseCount = 0;
  for (const course of COURSES) {
    const { lessons, ...courseData } = course;
    const created = await db.course.upsert({
      where: { slug: course.slug },
      create: {
        ...courseData, instructorId: admin.id, isPublished: true, publishedAt: new Date(),
        lessonCount: lessons.length, ratingAvg: 4.7, ratingCount: 42, enrollmentCount: 128,
      },
      update: {},
    });
    const existingLessons = await db.lesson.count({ where: { courseId: created.id } });
    if (existingLessons === 0) {
      for (const lesson of lessons) {
        await db.lesson.create({ data: { ...lesson, courseId: created.id } as any });
      }
    }
    courseCount++;
  }
  log.push(`✓ ${courseCount} courses created`);

  return NextResponse.json({ success: true, log, note: "Log in with admin@learnearn360.com / Password123" });
}
