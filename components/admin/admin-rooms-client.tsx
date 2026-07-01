"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Star, Trash2, ExternalLink } from "lucide-react";
import { formatNumber, formatDate, HUB_CATEGORIES } from "@/lib/utils";

type Props = { rooms: any[] };

export function AdminRoomsClient({ rooms }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const toggleFeatured = async (id: string, current: boolean) => {
    setLoading(id);
    const res = await fetch(`/api/admin/rooms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !current }),
    });
    if (res.ok) { toast({ title: current ? "Unfeatured" : "Featured!" }); router.refresh(); }
    setLoading(null);
  };

  const deleteRoom = async (id: string) => {
    if (!confirm("Delete this room? This cannot be undone.")) return;
    setLoading(id);
    const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
    if (res.ok) { toast({ title: "Room deleted" }); router.refresh(); }
    setLoading(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Rooms</h1>
        <p className="text-gray-500 text-sm mt-1">{rooms.length} rooms total</p>
      </div>

      <div className="bg-white/3 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="p-3 text-xs font-semibold text-gray-500">Room</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Category</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Owner</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Members</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Posts</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Created</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rooms.map((r) => {
              const cat = HUB_CATEGORIES.find((c) => c.value === r.category);
              return (
                <tr key={r.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-3">
                    <Link href={`/rooms/${r.slug}`} className="flex items-center gap-2 text-gray-200 hover:text-blue-400">
                      <span>{r.icon || "🏠"}</span> {r.name}
                      {r.isFeatured && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                    </Link>
                  </td>
                  <td className="p-3"><Badge variant="outline" className="text-xs">{cat?.icon} {cat?.label}</Badge></td>
                  <td className="p-3 text-gray-500">@{r.owner?.username}</td>
                  <td className="p-3 text-gray-400">{formatNumber(r._count.members)}</td>
                  <td className="p-3 text-gray-400">{formatNumber(r._count.posts)}</td>
                  <td className="p-3 text-gray-600 text-xs">{formatDate(r.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="ghost" onClick={() => toggleFeatured(r.id, r.isFeatured)} disabled={loading === r.id}
                        className="h-7 px-2 text-xs text-gray-600 hover:text-yellow-400">
                        <Star className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteRoom(r.id)} disabled={loading === r.id}
                        className="h-7 px-2 text-xs text-gray-600 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
