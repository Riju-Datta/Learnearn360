const testimonials = [
  {
    name: "Aisha Diallo",
    role: "Freelance Developer",
    avatar: "AD",
    color: "from-blue-500 to-purple-600",
    text: "I went from zero coding knowledge to landing my first $800 freelance project in 4 months. The accountability rooms kept me on track every single day.",
    badges: ["🔥 92-day streak", "💻 Code Master"],
  },
  {
    name: "Marcus Chen",
    role: "Product Manager at TechCo",
    avatar: "MC",
    color: "from-emerald-500 to-cyan-600",
    text: "The Career Hub's resume review + mock interviews got me through 3 rounds. I switched from marketing to PM in 6 months — something I thought was impossible.",
    badges: ["🎯 Career Switch", "📜 5 Certificates"],
  },
  {
    name: "Priya Sharma",
    role: "Content Creator & Freelancer",
    avatar: "PS",
    color: "from-pink-500 to-orange-500",
    text: "The Money-Making Hub gave me ideas I actually implemented. I now earn $2,000/month on top of my nursing job. The community made me believe it was possible.",
    badges: ["💰 $2K Side Income", "⭐ Top Contributor"],
  },
  {
    name: "Diego Morales",
    role: "Startup Co-founder",
    avatar: "DM",
    color: "from-yellow-500 to-orange-600",
    text: "Found my technical co-founder through the Startup Hub's co-founder matching. We validated our idea in 3 weeks and got our first 50 customers from the community.",
    badges: ["🚀 Startup Launched", "👥 Co-founder Found"],
  },
  {
    name: "Sarah Kim",
    role: "AI Automation Consultant",
    avatar: "SK",
    color: "from-violet-500 to-blue-600",
    text: "The AI Hub is unlike anything else. The prompt library alone saved me 10+ hours a week. I built an automation business charging $150/hour using what I learned here.",
    badges: ["🤖 AI Expert", "💡 150+ Prompts Saved"],
  },
  {
    name: "James Okonkwo",
    role: "Senior Software Engineer",
    avatar: "JO",
    color: "from-teal-500 to-emerald-600",
    text: "The daily coding challenges and pair programming sessions accelerated my skills faster than any bootcamp I paid $10,000 for. And this costs $19/month.",
    badges: ["🏆 Leaderboard Top 10", "⚡ Level 45"],
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-4">
            Real results
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Thousands have already made the switch
          </h2>
          <p className="text-lg text-gray-400">
            From beginners to $10K/month earners — the proof is in the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white/3 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-200 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
                <div className="ml-auto flex text-yellow-400 text-xs">★★★★★</div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">"{t.text}"</p>

              <div className="flex flex-wrap gap-2">
                {t.badges.map((b) => (
                  <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
