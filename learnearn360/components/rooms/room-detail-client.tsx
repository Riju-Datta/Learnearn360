"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/post-card";
import { CreatePostModal } from "@/components/posts/create-post-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Users, MessageSquare, Crown, Lock, Plus, Settings } from "lucide-react";
import { formatNumber, cn } from "@/lib/utils";

type Props = { room: any; posts: any[]; isMember: boolean; userRole: string | null; userId: string };

export function RoomDetailClient({ room, posts, isMember, userRole, userId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [memberState, setMemberState] = useState(isMember);
  const [showCreate, setShowCreate] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleJoinLeave = async () => {
    setJoining(true);
    try {
      const res = await fetch(`/api/rooms/${room.slug}/join`, { method: memberState ? "DELETE" : "POST" });
      if (res.ok) {
        setMemberState(!memberState);
        toast({ title: memberState ? "Left room" : "Joined! +5 XP 🎉" });
        router.refresh();
      }
    } finally { setJoining(false); }
  };

  const isAdmin = userRole === "admin" || room.owner?.id === userId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Room header */}
      <div className="bg-white/3 border border-white/10 rounded-xl overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-pink-900/20 flex items-center justify-center text-6xl relative">
          {room.icon || "🏠"}
          {room.isPremium && (
            <div className="absolute top-3 right-3">
              <Badge className="gap-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Crown className="w-3 h-3" /> Premium</Badge>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                {room.name}
                {room.type === "PRIVATE" && <Lock className="w-4 h-4 text-gray-500" />}
              </h1>
              {room.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{room.description}</p>}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {formatNumber(room._count.members)} members</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {formatNumber(room._count.posts)} posts</span>
                <span>by <Link href={`/profile/${room.owner?.username}`} className="text-blue-400 hover:underline">@{room.owner?.username}</Link></span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isAdmin && (
                <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-600 hover:text-gray-300">
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              <Button onClick={handleJoinLeave} disabled={joining}
                className={cn("h-9 px-4 text-sm font-medium",
                  memberState
                    ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                    : "bg-blue-600 hover:bg-blue-500 text-white border-0"
                )}>
                {joining ? "..." : memberState ? "Leave" : "Join Room"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create post */}
      {memberState && (
        <div className="mb-4">
          <button onClick={() => setShowCreate(true)}
            className="w-full flex items-center gap-3 bg-white/3 border border-white/10 rounded-xl p-4 hover:bg-white/5 hover:border-white/20 transition-all text-left">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-600">Share something with the community...</span>
          </button>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white/3 border border-white/10 rounded-xl">
            <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No posts yet</p>
            <p className="text-sm text-gray-700 mt-1">Be the first to post in this room!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {showCreate && <CreatePostModal rooms={[room]} onClose={() => setShowCreate(false)} />}
    </div>
  );
}
