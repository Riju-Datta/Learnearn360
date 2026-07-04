"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, HUB_CATEGORIES, getProgressToNextLevel, getLevelTitle } from "@/lib/utils";
import {
  Home, BookOpen, Code2, Rocket, Briefcase, Bot, Target,
  CheckSquare, DollarSign, Bell, User, Trophy, Settings,
  ChevronRight, Zap, Crown, LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/rooms", icon: Code2, label: "Rooms" },
  { href: "/library", icon: BookOpen, label: "Library" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
];

const hubItems = [
  { href: "/rooms?category=CODING", icon: "💻", label: "Coding" },
  { href: "/rooms?category=STARTUP", icon: "🚀", label: "Startup Hub" },
  { href: "/rooms?category=FREELANCING", icon: "💼", label: "Freelancing" },
  { href: "/rooms?category=AI", icon: "🤖", label: "AI Hub" },
  { href: "/rooms?category=CAREER", icon: "🎯", label: "Career Hub" },
  { href: "/rooms?category=ACCOUNTABILITY", icon: "✅", label: "Accountability" },
  { href: "/rooms?category=MONEY", icon: "💰", label: "Money-Making" },
];

type Props = { user: { id: string; name: string | null; image: string | null; username: string; xpTotal?: number; xpLevel?: number; plan: string } };

export function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const xp = (user as any).xpTotal || 0;
  const level = (user as any).xpLevel || 1;
  const { percent } = getProgressToNextLevel(xp);

  return (
    <aside className="w-64 h-screen bg-[#070d1a] border-r border-white/5 flex flex-col shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white">LearnEarn <span className="gradient-text">360</span></span>
        </Link>
      </div>

      {/* XP Card */}
      <div className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              {level}
            </div>
            <span className="text-xs font-medium text-blue-300">{getLevelTitle(level)}</span>
          </div>
          <span className="text-xs text-gray-500">{xp.toLocaleString()} XP</span>
        </div>
        <Progress value={percent} className="h-1.5 bg-white/10" />
        <p className="text-xs text-gray-600 mt-1">{percent}% to Level {level + 1}</p>
      </div>

      {/* Main Nav */}
      <nav className="p-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn("sidebar-item", active && "sidebar-item-active")}>
              <item.icon className="w-4 h-4" />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Hubs */}
      <div className="px-3 mb-2">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 px-3">Hubs</p>
        <div className="space-y-0.5">
          {hubItems.map((item) => {
            const active = pathname.includes(item.href.split("?")[0]) && new URLSearchParams(item.href.split("?")[1]).get("category") !== null;
            return (
              <Link key={item.href} href={item.href}
                className={cn("sidebar-item text-xs", active && "sidebar-item-active")}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-auto p-3 border-t border-white/5 space-y-1">
        {user.plan === "FREE" && (
          <Link href="/settings/billing"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-sm font-medium text-blue-300 hover:from-blue-600/30 hover:to-purple-600/30 transition-all">
            <Crown className="w-4 h-4 text-yellow-400" />
            Upgrade to Premium
          </Link>
        )}
        <Link href="/settings"
          className={cn("sidebar-item", pathname.startsWith("/settings") && "sidebar-item-active")}>
          <Settings className="w-4 h-4" />
          Settings
        </Link>

        {/* User */}
        <div className="flex items-center gap-2 px-3 py-2 mt-1">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
              {user.name?.[0] || user.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-300 truncate">{user.name || user.username}</p>
            <p className="text-xs text-gray-600 truncate">@{user.username}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-700 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
