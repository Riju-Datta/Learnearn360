"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Sun, Moon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useUnreadNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

type Props = { user: { name: string | null; image: string | null; username: string } };

export function TopBar({ user }: Props) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { data: unreadCount } = useUnreadNotifications();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/rooms?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="h-14 border-b border-white/5 bg-[#070d1a]/80 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rooms, courses, people..."
            className="pl-9 pr-4 h-9 bg-white/5 border-white/10 text-sm text-gray-300 placeholder:text-gray-700 focus:border-blue-500 focus:bg-white/8"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost" size="icon"
          className="w-9 h-9 text-gray-600 hover:text-gray-300 hover:bg-white/5"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="w-9 h-9 relative text-gray-600 hover:text-gray-300 hover:bg-white/5">
            <Bell className="w-4 h-4" />
            {!!unreadCount && unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </Button>
        </Link>

        <Link href={`/profile/${user.username}`}>
          <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-blue-500/50 transition-all">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
              {user.name?.[0] || user.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
