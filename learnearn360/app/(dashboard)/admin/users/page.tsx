import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminUsersClient } from "@/components/admin/admin-users-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Users" };

export default async function AdminUsersPage({ searchParams }: { searchParams: { search?: string; plan?: string } }) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const where: any = {};
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { email: { contains: searchParams.search, mode: "insensitive" } },
      { username: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }
  if (searchParams.plan) where.plan = searchParams.plan;

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
