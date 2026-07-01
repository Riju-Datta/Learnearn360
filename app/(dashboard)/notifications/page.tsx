import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NotificationsClient } from "@/components/notifications/notifications-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      actor: { select: { id: true, name: true, username: true, image: true } },
    },
  });

  // Mark all as read
  await db.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });

  return <NotificationsClient notifications={notifications} />;
}
