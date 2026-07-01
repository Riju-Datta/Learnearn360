"use client";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, getLevelTitle, cn } from "@/lib/utils";
import { Trophy, Flame, Zap, Crown } from "lucide-react";

type Props = { weekly: any[]; allTime: any[]; currentUserId: string };

function LeaderboardRow({ user, rank, isCurrentUser }: { user: any; rank: number; isCurrentUser: boolean }) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl border transition-all",
      isCurrentUser ? "bg-blue-500/10 border-blue-500/30" : "bg-white/2 border-white/5 hover:border-white/10"
    )}>
      <div className="w-8 text-center">
        {medal ? (
          <span className="text-lg">{medal}</span>
        ) : (
          <span className="text-sm font-bold text-gray-600">#{rank}</span>
        )}
      </div>

      <Link href={`/profile/${user.username}`} className="flex items-center gap-2.5 flex-1 min-w-0">
        <Avatar className="w-9 h-9 shrink-0">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            {user.name?.[0] || user.username?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-white truncate">{user.name || user.username}</p>
            {user.plan !== "FREE" && <Crown className="w-3 h-3 text-yellow-400 shrink-0" />}
            {isCurrentUser && <Badge variant="outline" className="text-xs border-blue-500/40 text-blue-400 px-1.5 py-0">You</Badge>}
          </div>
          <p className="text-xs text-gray-600 truncate">@{user.username} · {getLevelTitle(user.xpLevel)} Lv.{user.xpLevel}</p>
        </div>
      </Link>

      <div className="flex items-center gap-3 shrink-0 text-xs text-right">
        <div>
          <div className="flex items-center gap-1 justify-end text-orange-400">
            <Flame className="w-3 h-3" />
            <span className="font-semibold">{user.streakCurrent}</span>
          </div>
          <p className="text-gray-700">streak</p>
        </div>
        <div>
          <div className="flex items-center gap-1 justify-end text-blue-400">
            <Zap className="w-3 h-3" />
            <span className="font-bold text-sm text-white">{formatNumber(user.xpTotal)}</span>
          </div>
          <p className="text-gray-700">XP</p>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardClient({ weekly, allTime, currentUserId }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-500 text-sm">Top XP earners in the community</p>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[allTime[1], allTime[0], allTime[2]].map((user, i) => {
          if (!user) return <div key={i} />;
          const medals = ["🥈", "🥇", "🥉"];
          const heights = ["h-20", "h-28", "h-16"];
          const ranks = [2, 1, 3];
          return (
            <Link key={user.id} href={`/profile/${user.username}`}
              className="flex flex-col items-center text-center group">
              <Avatar className="w-12 h-12 ring-2 ring-yellow-500/30 mb-2">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {user.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium text-white truncate max-w-full">{user.name || user.username}</p>
              <p className="text-xs text-gray-600">{formatNumber(user.xpTotal)} XP</p>
              <div className={cn("w-full bg-gradient-to-t from-white/5 to-white/10 border border-white/10 rounded-t-lg mt-2 flex items-end justify-center pb-2 text-2xl", heights[i])}>
                {medals[i]}
              </div>
            </Link>
          );
        })}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Time</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="space-y-2">
            {allTime.map((user, i) => (
              <LeaderboardRow key={user.id} user={user} rank={i + 1} isCurrentUser={user.id === currentUserId} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="weekly">
          <div className="space-y-2">
            {weekly.map((user, i) => (
              <LeaderboardRow key={user.id} user={user} rank={i + 1} isCurrentUser={user.id === currentUserId} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
