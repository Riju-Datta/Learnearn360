"use client";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useRoomPosts(slug: string | undefined) {
  return useInfiniteQuery({
    queryKey: ["posts", "room", slug],
    queryFn: async ({ pageParam }) => {
      const url = `/api/rooms/${slug}/posts${pageParam ? `?cursor=${pageParam}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!slug,
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      const res = await fetch(`/api/posts/${postId}/likes`, { method: liked ? "DELETE" : "POST" });
      if (!res.ok) throw new Error("Failed to toggle like");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, saved }: { postId: string; saved: boolean }) => {
      const res = await fetch(`/api/posts/${postId}/save`, { method: saved ? "DELETE" : "POST" });
      if (!res.ok) throw new Error("Failed to toggle save");
      return res.json();
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roomSlug, data }: { roomSlug: string; data: any }) => {
      const res = await fetch(`/api/rooms/${roomSlug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
