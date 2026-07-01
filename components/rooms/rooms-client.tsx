"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Search, Users, MessageSquare, Lock, Crown, Star, Plus } from "lucide-react";
import { HUB_CATEGORIES, formatNumber, cn } from "@/lib/utils";

type Props = { rooms: any[]; userId: string; activeCategory?: string };

export function RoomsClient({ rooms, userId, activeCategory }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [joining, setJoining] = useState<string | null>(null);

  const filtered = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = async (slug: string, isMember: boolean) => {
    setJoining(slug);
    try {
      const res = await fetch(`/api/rooms/${slug}/join`, { method: isMember ? "DELETE" : "POST" });
      if (res.ok) {
        toast({ title: isMember ? "Left room" : "Joined! +5 XP 🎉" });
        router.refresh();
      }
    } finally { setJoining(null); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Community Rooms</h1>
          <p className="text-gray-500 text-sm mt-1">Join rooms, connect with peers, and grow together</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rooms..."
          className="pl-9 bg-white/5 border-white/10 text-gray-300 placeholder:text-gray-700" />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/rooms">
          <button className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
            !activeCategory ? "bg-blue-600/20 border-blue-500/40 text-blue-300" : "bg-white/3 border-white/10 text-gray-600 hover:text-gray-400")}>
            All Rooms
          </button>
        </Link>
        {HUB_CATEGORIES.map((c) => (
          <Link key={c.value} href={`/rooms?category=${c.value}`}>
            <button className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1",
              activeCategory === c.value ? "bg-blue-600/20 border-blue-500/40 text-blue-300" : "bg-white/3 border-white/10 text-gray-600 hover:text-gray-400")}>
              <span>{c.icon}</span> {c.label}
            </button>
          </Link>
        ))}
      </div>

      {/* Rooms grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No rooms found</p>
          <p className="text-sm text-gray-700 mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((room) => (
            <div key={room.id} className="group bg-white/3 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl flex flex-col">
              {/* Cover */}
              <div className={`h-20 flex items-center justify-center text-4xl relative ${room.isFeatured ? "bg-gradient-to-br from-blue-900/50 to-purple-900/50" : "bg-gradient-to-br from-gray-900/50 to-gray-800/30"}`}>
                {room.icon || "🏠"}
                {room.isFeatured && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="premium" className="text-xs gap-1"><Star className="w-3 h-3" /> Featured</Badge>
                  </div>
                )}
                {room.isPremium && (
                  <div className="absolute top-2 left-2">
                    <Badge className="text-xs gap-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Crown className="w-3 h-3" /> Premium</Badge>
                  </div>
                )}
                {room.type === "PRIVATE" && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/rooms/${room.slug}`} className="font-semibold text-white hover:text-blue-300 transition-colors leading-tight">
                    {room.name}
                  </Link>
                </div>
                {room.description && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-2">{room.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {formatNumber(room._count.members)} members</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {formatNumber(room._count.posts)} posts</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleJoin(room.slug, room.isMember)}
                  disabled={joining === room.slug}
                  className={cn("w-full h-8 text-xs font-medium",
                    room.isMember
                      ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                      : "bg-blue-600 hover:bg-blue-500 text-white border-0"
                  )}>
                  {joining === room.slug ? "..." : room.isMember ? "Leave" : "Join Room"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
