import type { User, Room, Post, Comment, Course, Badge, Notification } from "@prisma/client";

export type SafeUser = Omit<User, "password"> & {
  profile?: {
    bio: string | null;
    headline: string | null;
    location: string | null;
    skills: { name: string; proficiency: string }[];
    githubUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    websiteUrl: string | null;
    coverImage: string | null;
  } | null;
  _count?: {
    followers: number;
    following: number;
    posts: number;
  };
};

export type PostWithAuthor = Post & {
  author: Pick<User, "id" | "name" | "username" | "image">;
  room: Pick<Room, "id" | "name" | "slug" | "icon">;
  _count: { comments: number; likes: number };
  isLiked?: boolean;
  isSaved?: boolean;
};

export type CommentWithAuthor = Comment & {
  author: Pick<User, "id" | "name" | "username" | "image">;
  replies?: CommentWithAuthor[];
  _count: { likes: number };
  isLiked?: boolean;
};

export type RoomWithDetails = Room & {
  owner: Pick<User, "id" | "name" | "username" | "image">;
  _count: { members: number; posts: number };
  isMember?: boolean;
};

export type CourseWithDetails = Course & {
  instructor: Pick<User, "id" | "name" | "username" | "image">;
  _count: { lessons: number; enrollments: number };
  isEnrolled?: boolean;
  userProgress?: number;
};

export type NotificationWithActor = Notification & {
  actor: Pick<User, "id" | "name" | "username" | "image"> | null;
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
  total?: number;
};

export type XpAction =
  | "post_created"
  | "comment_created"
  | "lesson_complete"
  | "course_complete"
  | "daily_checkin"
  | "goal_completed"
  | "room_joined"
  | "badge_earned"
  | "streak_7"
  | "streak_30"
  | "account_created";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      username: string;
      role: string;
      plan: string;
    };
  }
}
