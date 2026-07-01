"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { formatNumber, formatDate, cn } from "@/lib/utils";

type Props = { courses: any[] };

export function AdminCoursesClient({ courses }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const togglePublish = async (id: string, current: boolean) => {
    setLoading(id);
    const res = await fetch(`/api/admin/courses/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    if (res.ok) { toast({ title: current ? "Unpublished" : "Published!" }); router.refresh(); }
    setLoading(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
        <p className="text-gray-500 text-sm mt-1">{courses.length} courses total</p>
      </div>

      <div className="bg-white/3 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="p-3 text-xs font-semibold text-gray-500">Course</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Instructor</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Lessons</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Enrolled</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Status</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Created</th>
              <th className="p-3 text-xs font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-white/3 transition-colors">
                <td className="p-3">
                  <Link href={`/library/course/${c.slug}`} className="text-gray-200 hover:text-blue-400">{c.title}</Link>
                </td>
                <td className="p-3 text-gray-500">@{c.instructor?.username}</td>
                <td className="p-3 text-gray-400">{c._count.lessons}</td>
                <td className="p-3 text-gray-400">{formatNumber(c._count.enrollments)}</td>
                <td className="p-3">
                  <Badge className={cn("text-xs", c.isPublished ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30")}>
                    {c.isPublished ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="p-3 text-gray-600 text-xs">{formatDate(c.createdAt)}</td>
                <td className="p-3">
                  <Button size="sm" variant="ghost" onClick={() => togglePublish(c.id, c.isPublished)} disabled={loading === c.id}
                    className="h-7 px-2 text-xs text-gray-600 hover:text-emerald-400">
                    {c.isPublished ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
