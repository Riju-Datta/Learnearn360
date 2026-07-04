"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatDate, cn } from "@/lib/utils";
import { Users, FileText, DollarSign, MessageSquare, BookOpen, Crown, TrendingUp, Home } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

type Props = { stats: any; recentUsers: any[]; signupsByDay: { date: string; count: number }[] };

export function AdminOverviewClient({ stats, recentUsers, signupsByDay }: Props) {
  const cards = [
    { label: "Total Users", value: formatNumber(stats.totalUsers), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Premium Subscribers", value: formatNumber(stats.premiumUsers), icon: Crown, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { label: "Monthly Revenue (est.)", value: `$${formatNumber(stats.mrr)}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "New Users Today", value: formatNumber(stats.newUsersToday), icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Total Posts", value: formatNumber(stats.totalPosts), icon: FileText, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
    { label: "Posts Today", value: formatNumber(stats.postsToday), icon: MessageSquare, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
    { label: "Total Rooms", value: formatNumber(stats.totalRooms), icon: Home, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
    { label: "Total Courses", value: formatNumber(stats.totalCourses), icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform-wide metrics and analytics</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white/3 border border-white/10 rounded-xl p-4">
            <div className={cn("w-9 h-9 rounded-lg border flex items-center justify-center mb-3", c.bg)}>
              <c.icon className={cn("w-4 h-4", c.color)} />
            </div>
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Signups chart */}
      <div className="bg-white/3 border border-white/10 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Signups — Last 30 Days</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={signupsByDay}>
            <defs>
              <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickFormatter={(d) => new Date(d).getDate().toString()} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #ffffff20", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSignups)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent users */}
      <div className="bg-white/3 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Signups</h2>
          <Link href="/admin/users" className="text-xs text-blue-400 hover:underline">View all users</Link>
        </div>
        <div className="divide-y divide-white/5">
          {recentUsers.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-3 hover:bg-white/3 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src={u.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">{u.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 truncate">{u.name || u.username}</p>
                <p className="text-xs text-gray-700 truncate">{u.email}</p>
              </div>
              <Badge variant={u.plan === "FREE" ? "outline" : "premium"} className="text-xs shrink-0">{u.plan}</Badge>
              <span className="text-xs text-gray-700 shrink-0">{formatDate(u.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
