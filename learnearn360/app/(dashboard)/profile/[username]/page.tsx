import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProfileClient } from "@/components/profile/profile-client";
import { Metadata } from "next";

type Props = { params: { username: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await db.user.findUnique({ where: { username: params.username } });
  return { title: user ? `${user.name || user.username} (@${user.username})` : "Profile" };
}

export default async function ProfilePage({ params }: Props) {
  const session = await auth();
  const currentUserId = session!.user.id;

  const user = await db.user.findUnique({
    where: { username: params.username },
    include: {
      profile: { include: { skills: true } },
      userBadges: { include: { badge: true }, orderBy: { earnedAt: "desc" } },
      _count: { select: { followers: true, following: true, posts: true, enrollments: true } },
    },
  });

  if (!user) notFound();

  const [posts, isFollowing] = await Promise.all([
    db.post.findMany({
      where: { authorId: user.id },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        room: { select: { id: true, name: true, slug: true, icon: true } },
        author: { select: { id: true, name: true, username: true, image: true } },
        _count: { select: { comments: true, likes: true } },
        likes: { where: { userId: currentUserId }, select: { id: true } },
      },
    }),
    db.follow.findFirst({ where: { followerId: currentUserId, followingId: user.id } }),
  ]);

  const postsWithFlags = posts.map((p) => ({ ...p, isLiked: p.likes.length > 0 }));
  const isOwnProfile = currentUserId === user.id;

  return <ProfileClient user={user} posts={postsWithFlags} isFollowing={!!isFollowing} isOwnProfile={isOwnProfile} />;
}
