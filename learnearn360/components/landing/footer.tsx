import Link from "next/link";
import { Zap } from "lucide-react";

const links = {
  Platform: ["Dashboard", "Rooms", "Library", "Leaderboard"],
  Community: ["Coding Hub", "Startup Hub", "Freelancing Hub", "AI Hub"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020b18] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white">LearnEarn <span className="gradient-text">360</span></span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              The all-in-one platform to learn, connect, and earn. Built for the next generation of creators and builders.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-600 hover:text-gray-300 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-700">© 2026 LearnEarn 360. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "YouTube", "Discord"].map((social) => (
              <Link key={social} href="#" className="text-sm text-gray-700 hover:text-gray-400 transition-colors">
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
