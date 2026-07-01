"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Bell, Heart, MessageCircle, UserPlus, Award, Zap, Star } from "lucide-react";

const ICONS: Record<string, any> = {
  POST_LIKED: { Icon: Heart, color: "text-red-400", bg: "bg-red-500/10" },
  POST_COMMENTED: { Icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
  COMMENT_LIKED: { Icon: Heart, color: "text-pink-400", bg: "bg-pink-500/10" },
  COMMENT_REPLIED: { Icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
  NEW_FOLLOWER: { Icon: UserPlus, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  BADGE_EARNED: { Icon: Award, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  LEVEL_UP: { Icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10" },
  COURSE_COMPLETED: { Icon: Star, color: "text-blue-400", bg: "bg-blue-500/10" },
  SYSTEM: { Icon: Bell, color: "text-gray-400", bg: "bg-gray-500/10" },
};

type Props = { notifications: any[] };

export function NotificationsClient({ notifications }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">{notifications.length} notifications</p>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white/3 border border-white/10 rounded-xl">
            <Bell className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-700 mt-1">We'll let you know when something happens</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const config = ICONS[notif.type] || ICONS.SYSTEM;
            const { Icon, color, bg } = config;
            return (
              <div key={notif.id} className={cn(
                "flex items-start gap-3 p-4 rounded-xl border transition-all",
                notif.isRead ? "bg-white/2 border-white/5" : "bg-blue-500/5 border-blue-500/20"
              )}>
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", bg)}>
                  <Icon className={cn("w-4 h-4", color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-300 leading-snug">
                      {notif.actor && (
                        <Link href={`/profile/${notif.actor.username}`} className="font-semibold text-white hover:underline mr-1">
                          {notif.actor.name || notif.actor.username}
                        </Link>
                      )}
                      {notif.title}
                    </p>
                    <span className="text-xs text-gray-700 shrink-0">{formatRelativeTime(notif.createdAt)}</span>
                  </div>
                  {notif.body && <p className="text-xs text-gray-600 mt-0.5">{notif.body}</p>}
                  {notif.link && (
                    <Link href={notif.link} className="text-xs text-blue-400 hover:underline mt-1 inline-block">
                      View →
                    </Link>
                  )}
                </div>
                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
