"use client";
import { Progress } from "@/components/ui/progress";
import { getProgressToNextLevel, getLevelTitle } from "@/lib/utils";
import { Flame, Zap, Star } from "lucide-react";

type Props = { xp: number; level: number; streak: number; badges: any[] };

export function XpCard({ xp, level, streak, badges }: Props) {
  const { current, needed, percent } = getProgressToNextLevel(xp);

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
            {level}
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-300">{getLevelTitle(level)}</p>
            <p className="text-xs text-gray-600">Level {level}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-2.5 py-1">
          <Flame className="w-3 h-3 text-orange-400" />
          <span className="text-xs font-bold text-orange-300">{streak}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-500">{xp.toLocaleString()} XP total</span>
          <span className="text-gray-600">{current}/{needed} to Lv.{level + 1}</span>
        </div>
        <Progress value={percent} className="h-2 bg-white/10" />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-blue-400" />
            <span className="text-sm font-bold text-white">{xp.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-700 mt-0.5">Total XP</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-sm font-bold text-white">{streak}</span>
          </div>
          <p className="text-xs text-gray-700 mt-0.5">Day Streak</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="text-sm font-bold text-white">{badges.length}</span>
          </div>
          <p className="text-xs text-gray-700 mt-0.5">Badges</p>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
          {badges.slice(0, 5).map((ub: any) => (
            <div key={ub.id} title={ub.badge.name}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-base cursor-default hover:scale-110 transition-transform">
              {ub.badge.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
