"use client";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Pin } from "lucide-react";
import { formatRelativeTime, formatNumber, cn } from "@/lib/utils";

type Props = { post: any };

export function PostCard({ post }: Props) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [saved, setSaved] = useState(post.isSaved || false);
  const { toast } = useToast();

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c: number) => wasLiked ? c - 1 : c + 1);
    const res = await fetch(`/api/posts/${post.id}/likes`, { method: wasLiked ? "DELETE" : "POST" });
    if (!res.ok) { setLiked(wasLiked); setLikeCount((c: number) => wasLiked ? c + 1 : c - 1); }
    else if (!wasLiked) toast({ title: "+2 XP!", description: "Post liked 👍" });
  };

  const handleSave = async () => {
    setSaved(!saved);
    await fetch(`/api/posts/${post.id}/save`, { method: saved ? "DELETE" : "POST" });
    toast({ title: saved ? "Removed from saved" : "Saved! 🔖" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/rooms/${post.room?.slug}?post=${post.id}`);
    toast({ title: "Link copied!", description: "Share it with someone awesome" });
  };

  return (
    <article className="bg-white/3 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <Link href={`/profile/${post.author?.username}`}>
            <Avatar className="w-9 h-9">
              <AvatarImage src={post.author?.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {post.author?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link href={`/profile/${post.author?.username}`} className="text-sm font-medium text-white hover:underline">
                {post.author?.name || post.author?.username}
              </Link>
              <span className="text-gray-700 text-xs">·</span>
              <span className="text-xs text-gray-600">{formatRelativeTime(post.createdAt)}</span>
            </div>
            {post.room && (
              <Link href={`/rooms/${post.room.slug}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                <span>{post.room.icon || "🏠"}</span>
                <span>{post.room.name}</span>
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {post.isPinned && <Pin className="w-3.5 h-3.5 text-yellow-400" />}
          <Button variant="ghost" size="icon" className="w-7 h-7 text-gray-700 hover:text-gray-400 opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {post.title && <h3 className="font-semibold text-white mb-1.5 leading-snug">{post.title}</h3>}
        {post.body && (
          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
            {post.body.length > 300 ? post.body.slice(0, 300) + "..." : post.body}
          </p>
        )}
        {post.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
            <img src={post.imageUrl} alt="" className="w-full max-h-80 object-cover" />
          </div>
        )}
        {post.linkUrl && (
          <a href={post.linkUrl} target="_blank" rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg text-xs text-blue-400 hover:bg-white/8 transition-colors">
            🔗 {post.linkUrl}
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2.5 border-t border-white/5">
        <Button variant="ghost" size="sm" onClick={handleLike}
          className={cn("h-8 px-3 gap-1.5 text-xs transition-all", liked ? "text-red-400 hover:text-red-300" : "text-gray-600 hover:text-gray-400")}>
          <Heart className={cn("w-4 h-4", liked && "fill-current")} />
          {formatNumber(likeCount)}
        </Button>

        <Link href={`/rooms/${post.room?.slug}?post=${post.id}`}>
          <Button variant="ghost" size="sm" className="h-8 px-3 gap-1.5 text-xs text-gray-600 hover:text-gray-400">
            <MessageCircle className="w-4 h-4" />
            {formatNumber(post._count?.comments || post.commentCount || 0)}
          </Button>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleSave}
            className={cn("h-8 px-2 text-xs", saved ? "text-blue-400" : "text-gray-700 hover:text-gray-400")}>
            <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-2 text-gray-700 hover:text-gray-400">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
