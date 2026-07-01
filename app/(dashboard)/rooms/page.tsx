import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RoomsClient } from "@/components/rooms/rooms-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Rooms" };

export default async function RoomsPage({ searchParams }: { searchParams: { category?: string; search?: string } }) {
  const session = await auth();
  const userId = session!.user.id;

  const where: any = {};
  if (searchParams.category) where.category = searchParams.category;
  if (searchParams.search) where.name = { contains: searchParams.search, mode: "insensitive" };

  const [rooms, myRoomIds] = await Promise.all([
    db.room.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { memberCount: "desc" }],
      include: {
        owner: { select: { id: true, name: true, username: true, image: true } },
        _count: { select: { members: true, posts: true } },
      },
    }),
    db.roomMember.findMany({ where: { userId }, select: { roomId: true } }),
  ]);

  const memberSet = new Set(myRoomIds.map((m) => m.roomId));
  const roomsWithMembership = rooms.map((r) => ({ ...r, isMember: memberSet.has(r.id) }));

  return <RoomsClient rooms={roomsWithMembership} userId={userId} activeCategory={searchParams.category} />;
}
