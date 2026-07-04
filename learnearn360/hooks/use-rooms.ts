"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useRoom(slug: string | undefined) {
  return useQuery({
    queryKey: ["room", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/rooms/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch room");
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useRooms(params?: { category?: string; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.search) searchParams.set("search", params.search);

  return useQuery({
    queryKey: ["rooms", params],
    queryFn: async () => {
      const res = await fetch(`/api/rooms?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch rooms");
      return res.json();
    },
  });
}

export function useJoinRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, leave }: { slug: string; leave: boolean }) => {
      const res = await fetch(`/api/rooms/${slug}/join`, { method: leave ? "DELETE" : "POST" });
      if (!res.ok) throw new Error("Failed to join/leave room");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
