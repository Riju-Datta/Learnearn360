import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { RoomDetailClient } from "@/components/rooms/room-detail-client";
import { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = await db.room.findUnique({ where: { slug } });
  return { title: room?.name || "Room" };
}

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const room = await db.room.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { members: true, posts: true } },
      members: { where: { userId }, select: { role: true } },
    },
  });

  if (!room) notFound();

  const posts = await db.post.findMany({
    where: { roomId: room.id },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: 20,
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      room: { select: { id: true, name: true, slug: true, icon: true } },
      _count: { select: { comments: true, likes: true } },
      likes: { where: { userId }, select: { id: true } },
      savedBy: { where: { userId }, select: { id: true } },
    },
  });

  const isMember = room.members.length > 0;
  const userRole = room.members[0]?.role || null;
  const postsWithFlags = posts.map((p) => ({ ...p, isLiked: p.likes.length > 0, isSaved: p.savedBy.length > 0 }));

  return <RoomDetailClient room={room} posts={postsWithFlags} isMember={isMember} userRole={userRole} userId={userId} />;
}
