"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCourse(slug: string | undefined) {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/courses/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch course");
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useCourses(params?: { category?: string; level?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.category && params.category !== "All") searchParams.set("category", params.category);
  if (params?.level && params.level !== "All") searchParams.set("level", params.level);

  return useQuery({
    queryKey: ["courses", params],
    queryFn: async () => {
      const res = await fetch(`/api/courses?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    },
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/courses/${slug}/enroll`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Enrollment failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useCompletLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseSlug, lessonId }: { courseSlug: string; lessonId: string }) => {
      const res = await fetch(`/api/courses/${courseSlug}/lessons/${lessonId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to mark lesson complete");
      return res.json();
    },
    onSuccess: (_, { courseSlug }) => {
      queryClient.invalidateQueries({ queryKey: ["course", courseSlug] });
    },
  });
}
