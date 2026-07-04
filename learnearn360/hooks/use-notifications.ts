"use client";
import { useQuery } from "@tanstack/react-query";

async function fetchUnreadCount(): Promise<number> {
  const res = await fetch("/api/users/me/notifications/unread-count");
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count;
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadCount,
    refetchInterval: 30_000, // poll every 30s
  });
}
