import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

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
  { name: "Pair Programming Lounge", slug: "pair-programming", category: "CODING" as const, icon: "👥", description: "Find a partner, build something together." },
  { name: "Resource Library", slug: "resource-library", category: "LIBRARY" as const, icon: "📚", description: "Community-shared notes, templates, and roadmaps." },
  { name: "Startup Idea Lab", slug: "startup-idea-lab", category: "STARTUP" as const, icon: "🚀", description: "Validate your startup idea with real feedback.", isFeatured: true },
  { name: "Find a Co-founder", slug: "find-cofounder", category: "STARTUP" as const, icon: "🤝", description: "Looking for a technical or business co-founder?" },
  { name: "Freelance Wins & Lessons", slug: "freelance-wins", category: "FREELANCING" as const, icon: "💼", description: "Share client wins, proposal tips, and lessons learned." },
  { name: "Proposal Templates", slug: "proposal-templates", category: "FREELANCING" as const, icon: "📄", description: "Browse and share proposal templates by niche." },
  { name: "AI Tools Spotlight", slug: "ai-tools-spotlight", category: "AI" as const, icon: "🤖", description: "Weekly spotlight on the best new AI tools.", isFeatured: true },
  { name: "Prompt Engineering", slug: "prompt-engineering", category: "AI" as const, icon: "✨", description: "Share and discover high-performing prompts." },
  { name: "Resume Review Circle", slug: "resume-review", category: "CAREER" as const, icon: "📋", description: "Get your resume reviewed by the community." },
  { name: "Interview Prep Squad", slug: "interview-prep", category: "CAREER" as const, icon: "🎯", description: "Mock interviews and question banks." },
  { name: "Job Board Discussions", slug: "job-board-talk", category: "CAREER" as const, icon: "💼", description: "Discuss openings, referrals, and applications." },
  { name: "Morning Accountability", slug: "morning-accountability", category: "ACCOUNTABILITY" as const, icon: "🌅", description: "Post your 3 goals every morning. Check in daily." },
  { name: "Deep Work Sessions", slug: "deep-work-sessions", category: "ACCOUNTABILITY" as const, icon: "⏱️", description: "Join live co-working pomodoro sessions." },
  { name: "Side Hustle Ideas", slug: "side-hustle-ideas", category: "MONEY" as const, icon: "💰", description: "Validated side hustle ideas with income potential.", isFeatured: true },
  { name: "Content Creator Corner", slug: "content-creator-corner", category: "MONEY" as const, icon: "🎥", description: "YouTube, TikTok, newsletters — grow your audience." },
  { name: "E-commerce Builders", slug: "ecommerce-builders", category: "MONEY" as const, icon: "🛍️", description: "Shopify, Gumroad, Etsy — build your store." },
];

const COURSES = [
  {
    title: "Web Development Fundamentals",
    slug: "web-dev-fundamentals",
    description: "Learn HTML, CSS, and JavaScript from scratch. Build your first website in 4 weeks.",
    category: "Coding", level: "BEGINNER" as const, price: 0, isPremium: false,
    lessons: [
      { title: "Welcome & Setup", type: "TEXT" as const, body: "Welcome to Web Development Fundamentals! In this course you'll learn the building blocks of the web.", sortOrder: 1, isFreePreview: true },
      { title: "HTML Basics", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/UB1O30fR-EE", durationSeconds: 1800, sortOrder: 2, isFreePreview: true },
      { title: "CSS Styling", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc", durationSeconds: 2400, sortOrder: 3 },
      { title: "JavaScript Basics", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/W6NZfCO5SIk", durationSeconds: 3600, sortOrder: 4 },
      { title: "Build Your First Page", type: "ASSIGNMENT" as const, body: "Build a personal landing page using everything you've learned.", sortOrder: 5 },
    ],
  },
  {
    title: "Freelancing 101: Land Your First Client",
    slug: "freelancing-101",
    description: "A practical, no-fluff guide to getting your first paying freelance client.",
    category: "Freelancing", level: "BEGINNER" as const, price: 0, isPremium: false,
    lessons: [
      { title: "Choosing Your Niche", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", durationSeconds: 900, sortOrder: 1, isFreePreview: true },
      { title: "Building a Portfolio", type: "TEXT" as const, body: "Your portfolio doesn't need 10 projects — it needs 3 great ones.", sortOrder: 2 },
      { title: "Writing Winning Proposals", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", durationSeconds: 1200, sortOrder: 3 },
      { title: "Pricing Your Services", type: "QUIZ" as const, quizData: { questions: [{ question: "What pricing model is best for beginners?", options: ["Hourly", "Fixed-price", "Retainer", "Equity"], correct: 1 }] }, sortOrder: 4 },
    ],
  },
  {
    title: "AI Prompt Engineering Mastery",
    slug: "ai-prompt-engineering",
    description: "Master the art of prompting AI tools to get exactly the output you need.",
    category: "AI", level: "INTERMEDIATE" as const, price: 49, isPremium: true,
    lessons: [
      { title: "How LLMs Actually Work", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", durationSeconds: 1500, sortOrder: 1, isFreePreview: true },
      { title: "Prompt Patterns That Work", type: "TEXT" as const, body: "Chain-of-thought, few-shot, role-based prompting — learn the patterns.", sortOrder: 2 },
      { title: "Building AI Workflows", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", durationSeconds: 2100, sortOrder: 3 },
    ],
  },
  {
    title: "From Idea to Startup: 30-Day Launch Plan",
    slug: "idea-to-startup",
    description: "Validate, build, and launch your startup idea in 30 days — step by step.",
    category: "Startup", level: "INTERMEDIATE" as const, price: 79, isPremium: true,
    lessons: [
      { title: "Validating Your Idea", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", durationSeconds: 1800, sortOrder: 1, isFreePreview: true },
      { title: "Finding Your First 10 Customers", type: "TEXT" as const, body: "Forget scale. Focus on 10 people who desperately need what you're building.", sortOrder: 2 },
      { title: "MVP Build Sprint", type: "ASSIGNMENT" as const, body: "Build and ship your MVP this week.", sortOrder: 3 },
    ],
  },
  {
    title: "Resume & LinkedIn Optimization",
    slug: "resume-linkedin-optimization",
    description: "Get past ATS filters and land more interviews with an optimized resume and LinkedIn.",
    category: "Career", level: "BEGINNER" as const, price: 0, isPremium: false,
    lessons: [
      { title: "ATS-Proof Resume Formatting", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", durationSeconds: 1200, sortOrder: 1, isFreePreview: true },
      { title: "Writing Impact Statements", type: "TEXT" as const, body: "Use the formula: Action verb + what you did + measurable result.", sortOrder: 2 },
      { title: "LinkedIn Profile Makeover", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", durationSeconds: 1500, sortOrder: 3 },
    ],
  },
  {
    title: "Python for Data Analysis",
    slug: "python-data-analysis",
    description: "Learn pandas, numpy, and data visualization to analyze real-world datasets.",
    category: "Coding", level: "INTERMEDIATE" as const, price: 59, isPremium: true,
    lessons: [
      { title: "Pandas Fundamentals", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", durationSeconds: 2400, sortOrder: 1, isFreePreview: true },
      { title: "Data Cleaning Techniques", type: "TEXT" as const, body: "80% of data analysis is cleaning. Here's how to do it efficiently.", sortOrder: 2 },
      { title: "Visualization with Matplotlib", type: "VIDEO" as const, contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", durationSeconds: 1800, sortOrder: 3 },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // ── Badges ──
  console.log("Creating badges...");
  for (const badge of BADGES) {
    await db.badge.upsert({ where: { name: badge.name }, create: badge as any, update: badge as any });
  }

  // ── Demo users ──
  console.log("Creating demo users...");
  const password = await bcrypt.hash("Password123", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@learnearn360.com" },
    create: {
      email: "admin@learnearn360.com", username: "admin", name: "Admin User",
      password, role: "ADMIN", plan: "LIFETIME", emailVerified: new Date(), xpTotal: 50000, xpLevel: 23,
      streakCurrent: 45, streakLongest: 90,
      profile: { create: { bio: "Platform administrator.", headline: "LearnEarn 360 Team", experienceLevel: "advanced" } },
    },
    update: {},
  });

  const demoUsers = [
    { email: "aisha@example.com", username: "aisha_codes", name: "Aisha Diallo", headline: "Freelance Developer", bio: "Learning to code, one project at a time. From Lagos 🇳🇬", xp: 8420, level: 10, streak: 92 },
    { email: "marcus@example.com", username: "marcus_pm", name: "Marcus Chen", headline: "Product Manager", bio: "Career switcher: Marketing → Product Management.", xp: 12300, level: 12, streak: 31 },
    { email: "priya@example.com", username: "priya_creates", name: "Priya Sharma", headline: "Content Creator & Freelancer", bio: "Nurse by day, side-hustler by night. $2K/mo and counting.", xp: 6700, level: 9, streak: 18 },
    { email: "diego@example.com", username: "diego_builds", name: "Diego Morales", headline: "Startup Co-founder", bio: "Building the next big thing. Always looking to connect.", xp: 15200, level: 14, streak: 60 },
  ];

  const createdUsers = [admin];
  for (const u of demoUsers) {
    const user = await db.user.upsert({
      where: { email: u.email },
      create: {
        email: u.email, username: u.username, name: u.name, password,
        emailVerified: new Date(), xpTotal: u.xp, xpLevel: u.level,
        streakCurrent: u.streak, streakLongest: u.streak + 10, plan: "FREE",
        profile: { create: { headline: u.headline, bio: u.bio, experienceLevel: "intermediate" } },
      },
      update: {},
    });
    createdUsers.push(user);
  }

  // ── Rooms ──
  console.log("Creating rooms...");
  const createdRooms = [];
  for (const room of ROOMS) {
    const owner = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const r = await db.room.upsert({
      where: { slug: room.slug },
      create: { ...room, ownerId: owner.id, memberCount: 0, postCount: 0 },
      update: {},
    });
    createdRooms.push(r);
  }

  // ── Memberships (everyone joins a handful of rooms) ──
  console.log("Creating room memberships...");
  for (const user of createdUsers) {
    const roomsToJoin = createdRooms.sort(() => 0.5 - Math.random()).slice(0, 6);
    for (const room of roomsToJoin) {
      await db.roomMember.upsert({
        where: { roomId_userId: { roomId: room.id, userId: user.id } },
        create: { roomId: room.id, userId: user.id, role: room.ownerId === user.id ? "admin" : "member" },
        update: {},
      });
    }
  }
  // Update member counts
  for (const room of createdRooms) {
    const count = await db.roomMember.count({ where: { roomId: room.id } });
    await db.room.update({ where: { id: room.id }, data: { memberCount: count } });
  }

  // ── Sample posts ──
  console.log("Creating sample posts...");
  const samplePosts = [
    { body: "Just landed my first freelance client! 🎉 $800 for a landing page build. The proposal templates in this community made all the difference.", roomSlug: "freelance-wins" },
    { body: "Day 47 of my coding streak! Today I finally understood closures in JavaScript. It clicked after building a counter app from scratch.", roomSlug: "js-daily-challenges" },
    { body: "Looking for a technical co-founder for a B2B SaaS idea in the logistics space. I handle sales/ops, need someone strong in backend + infra.", roomSlug: "find-cofounder" },
    { body: "PSA: ChatGPT's custom instructions feature is a game changer for consistent output. Here's the exact prompt structure I use for client work...", roomSlug: "prompt-engineering" },
    { body: "Finished my resume rewrite using the feedback from this room. Already got 2 interview callbacks this week. Thank you all! 🙏", roomSlug: "resume-review" },
    { body: "Morning goals: 1) Finish module 3 of the Python course 2) Apply to 3 jobs 3) 30 min deep work on side project. Let's go!", roomSlug: "morning-accountability" },
    { body: "Started a print-on-demand store last month. $340 in sales so far with zero ad spend, just organic Pinterest. Happy to share what's working.", roomSlug: "ecommerce-builders" },
  ];

  for (const sp of samplePosts) {
    const room = createdRooms.find((r) => r.slug === sp.roomSlug);
    const author = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    if (room) {
      const post = await db.post.create({
        data: { roomId: room.id, authorId: author.id, type: "TEXT", body: sp.body, likeCount: Math.floor(Math.random() * 40) },
      });
      await db.room.update({ where: { id: room.id }, data: { postCount: { increment: 1 } } });
    }
  }

  // ── Courses ──
  console.log("Creating courses...");
  for (const course of COURSES) {
    const { lessons, ...courseData } = course;
    const instructor = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const created = await db.course.upsert({
      where: { slug: course.slug },
      create: {
        ...courseData,
        instructorId: instructor.id,
        isPublished: true,
        publishedAt: new Date(),
        durationMinutes: lessons.reduce((sum, l: any) => sum + (l.durationSeconds || 0), 0) / 60,
        lessonCount: lessons.length,
        ratingAvg: 4.5 + Math.random() * 0.5,
        ratingCount: Math.floor(Math.random() * 200) + 20,
        enrollmentCount: Math.floor(Math.random() * 500) + 50,
      },
      update: {},
    });

    for (const lesson of lessons) {
      await db.lesson.create({ data: { ...lesson, courseId: created.id } as any });
    }
  }

  console.log("✅ Seed complete!");
  console.log(`
  Demo accounts (password: Password123):
  - admin@learnearn360.com (ADMIN)
  - aisha@example.com
  - marcus@example.com
  - priya@example.com
  - diego@example.com
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
