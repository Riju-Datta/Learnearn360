import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsClient } from "@/components/settings/settings-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  const user = await db.user.findUnique({
    where: { id: session!.user.id },
    include: { profile: { include: { skills: true } } },
  });

  return <SettingsClient user={user} />;
}
