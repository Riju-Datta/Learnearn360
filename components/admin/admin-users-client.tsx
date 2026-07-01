"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Ban, Shield, CheckCircle2, XCircle } from "lucide-react";
import { formatDate, formatNumber, cn } from "@/lib/utils";

type Props = { users: any[] };

export function AdminUsersClient({ users }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/users?search=${encodeURIComponent(search)}`);
  };

  const handleBan = async (userId: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, { method: "PATCH" });
      if (res.ok) { toast({ title: "User banned" }); router.refresh(); }
    } finally { setActionLoading(null); }
  };

  const handleMakeAdmin = async (userId: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "ADMIN" }),
      });
      if (res.ok) { toast({ title: "Promoted to Admin" }); router.refresh(); }
    } finally { setActionLoading(null); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} users</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, username..."
          className="pl-9 bg-white/5 border-white/10 text-gray-300" />
      </form>

      <div className="bg-white/3 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="p-3 text-xs font-semibold text-gray-500">User</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Plan</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Role</th>
              <th className="p-3 text-xs font-semibold text-gray-500">XP</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Verified</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Joined</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/3 transition-colors">
                <td className="p-3">
                  <Link href={`/profile/${u.username}`} className="flex items-center gap-2.5">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={u.image || ""} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">{u.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-200 font-medium">{u.name || u.username}</p>
                      <p className="text-xs text-gray-600">{u.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="p-3"><Badge variant={u.plan === "FREE" ? "outline" : "premium"} className="text-xs">{u.plan}</Badge></td>
                <td className="p-3 text-gray-400">{u.role}</td>
                <td className="p-3 text-gray-400">{formatNumber(u.xpTotal)}</td>
                <td className="p-3">
                  {u.emailVerified ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-gray-700" />}
                </td>
                <td className="p-3 text-gray-600 text-xs">{formatDate(u.createdAt)}</td>
                <td className="p-3">
                  <div className="flex gap-1.5">
                    {u.role !== "ADMIN" && (
                      <Button size="sm" variant="ghost" onClick={() => handleMakeAdmin(u.id)} disabled={actionLoading === u.id}
                        className="h-7 px-2 text-xs text-gray-600 hover:text-blue-400">
                        <Shield className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleBan(u.id)} disabled={actionLoading === u.id}
                      className="h-7 px-2 text-xs text-gray-600 hover:text-red-400">
                      <Ban className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
