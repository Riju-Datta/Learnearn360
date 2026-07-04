"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/posts/post-card";
import { DailyGoals } from "@/components/gamification/daily-goals";
import { XpCard } from "@/components/gamification/xp-card";
import { formatRelativeTime, getProgressToNextLevel, getLevelTitle } from "@/lib/utils";
import { Flame, Target, Users, BookOpen, Plus, ArrowRight, Zap } from "lucide-react";
import { CreatePostModal } from "@/components/posts/create-post-modal";

export function DashboardClient({ user, rooms, enrollments, goals, posts }: any) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const xp = user?.xpTotal || 0;
  const level = user?.xpLevel || 1;
  const { percent } = getProgressToNextLevel(xp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
          <span className="gradient-text">{user?.name?.split(" ")[0] || user?.username}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {user?.streakCurrent > 0 ? `🔥 ${user.streakCurrent}-day streak! Keep it going.` : "Start your learning streak today!"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Create post prompt */}
          <div className="bg-white/3 border border-white/10 rounded-xl p-4 flex items-center gap-3">
            <Avatar className="w-9 h-9 shrink-0">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <button onClick={() => setShowCreatePost(true)}
              className="flex-1 text-left text-sm text-gray-600 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 hover:bg-white/8 hover:text-gray-400 transition-colors">
              What are you working on today?
            </button>
            <Button size="sm" onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white border-0 shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Post
            </Button>
          </div>

          {/* Posts feed */}
          <div className="space-y-4">
            {posts?.length > 0 ? posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            )) : (
              <div className="bg-white/3 border border-white/10 rounded-xl p-12 text-center">
                <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Your feed is empty</p>
                <p className="text-sm text-gray-700 mt-1">Join some rooms to see posts here</p>
                <Link href="/rooms">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white border-0">Explore Rooms</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-4">
          {/* XP & Level */}
          <XpCard xp={xp} level={level} streak={user?.streakCurrent || 0} badges={user?.userBadges || []} />

          {/* Daily Goals */}
          <DailyGoals goals={goals} />

          {/* My Rooms */}
          {rooms?.length > 0 && (
            <div className="bg-white/3 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">My Rooms</h3>
                <Link href="/rooms" className="text-xs text-blue-400 hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {rooms.map((room: any) => (
                  <Link key={room.id} href={`/rooms/${room.slug}`}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-white/10 flex items-center justify-center text-sm shrink-0">
                      {room.icon || "🏠"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-300 truncate group-hover:text-white">{room.name}</p>
                      <p className="text-xs text-gray-700">{room._count.members} members</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-gray-700 group-hover:text-gray-400 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Courses in progress */}
          {enrollments?.length > 0 && (
            <div className="bg-white/3 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">In Progress</h3>
                <Link href="/library" className="text-xs text-blue-400 hover:underline">All courses</Link>
              </div>
              <div className="space-y-3">
                {enrollments.map((en: any) => (
                  <Link key={en.id} href={`/library/course/${en.course.slug}`}
                    className="block p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                    <p className="text-xs font-medium text-gray-300 truncate mb-1">{en.course.title}</p>
                    <Progress value={en.progressPercent} className="h-1 bg-white/10" />
                    <p className="text-xs text-gray-700 mt-1">{en.progressPercent}% complete</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreatePost && <CreatePostModal rooms={rooms} onClose={() => setShowCreatePost(false)} />}
    </div>
  );
}
