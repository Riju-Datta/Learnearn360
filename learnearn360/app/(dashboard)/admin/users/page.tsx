import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminUsersClient } from "@/components/admin/admin-users-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Users" };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ search?: string; plan?: string }> }) {
  const params = await searchParams;
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const where: any = {};
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
      { username: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.plan) where.plan = params.plan;

  const users = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true, name: true, username: true, email: true, image: true,
      plan: true, role: true, xpTotal: true, createdAt: true, emailVerified: true,
      _count: { select: { posts: true, followers: true } },
    },
  });

  return <AdminUsersClient users={users} />;
}
