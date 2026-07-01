const steps = [
  {
    number: "01",
    title: "Create your free account",
    description: "Sign up in 30 seconds. Take a quick quiz and get a personalized learning path built around your goals.",
    icon: "🎯",
  },
  {
    number: "02",
    title: "Join your community hubs",
    description: "Jump into rooms built for your interests — coding, freelancing, AI, startups. Connect with people on the same path.",
    icon: "🏠",
  },
  {
    number: "03",
    title: "Learn and build every day",
    description: "Follow structured courses, complete daily challenges, track your streak, and earn XP for every action.",
    icon: "📚",
  },
  {
    number: "04",
    title: "Land clients, jobs, or launch",
    description: "Use the freelance hub, job board, and startup tools to convert your skills into real income.",
    icon: "💰",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            How it works
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            From zero to income in 4 steps
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A clear path from where you are to where you want to be.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center group">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 mb-6 text-3xl group-hover:scale-110 transition-transform duration-200">
                {step.icon}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
