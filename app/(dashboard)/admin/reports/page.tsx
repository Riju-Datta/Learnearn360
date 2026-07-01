import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Reports" };

export default async function AdminReportsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  // Reports feature stub — extend with db.report model as needed
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reports & Moderation</h1>
        <p className="text-gray-500 text-sm mt-1">Review reported content from the community</p>
      </div>
      <div className="bg-white/3 border border-white/10 rounded-xl p-12 text-center">
        <p className="text-4xl mb-4">🛡️</p>
        <p className="text-gray-400 font-medium">No open reports</p>
        <p className="text-sm text-gray-600 mt-1">All clear! No content has been flagged for review.</p>
      </div>
    </div>
  );
}
