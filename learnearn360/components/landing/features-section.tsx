import { BookOpen, Users, Target, DollarSign, Trophy, Bell, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Structured Learning",
    description: "Video courses, roadmaps, quizzes, and certificates. Progress at your own pace with guided paths from zero to job-ready.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Users,
    title: "8 Community Hubs",
    description: "Join rooms for Coding, Freelancing, Startups, AI, Career, Accountability, and more. Find your people.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Target,
    title: "Accountability System",
    description: "Daily goals, habit tracking, co-working sessions, and accountability partners. Never lose momentum again.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: DollarSign,
    title: "Earning Opportunities",
    description: "Freelance hub, job board, startup collaboration, and money-making guides. Turn your skills into income.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "XP points, levels, streaks, badges, and leaderboards. Learning feels like a game — in the best way.",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: Zap,
    title: "AI Hub & Tools",
    description: "Curated AI tools, prompt libraries, workflow automation tutorials. Stay ahead of the AI revolution.",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Streak reminders, activity digests, live session alerts. Stay engaged without being overwhelmed.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Verified Certificates",
    description: "Earn shareable certificates on course completion. LinkedIn-optimized and employer-recognized.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            One platform. Infinite possibilities.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Stop bouncing between YouTube, Discord, Udemy, LinkedIn, and Notion. Everything lives here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={f.title}
              className={`group p-6 rounded-xl border bg-white/3 hover:bg-white/6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
              style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${f.bg}`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
