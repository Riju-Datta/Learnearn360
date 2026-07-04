import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminRoomsClient } from "@/components/admin/admin-rooms-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Rooms" };

export default async function AdminRoomsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const rooms = await db.room.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { name: true, username: true } },
      _count: { select: { members: true, posts: true } },
    },
  });

  return <AdminRoomsClient rooms={rooms} />;
}
