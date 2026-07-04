import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      <nav className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white">LearnEarn <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">360</span></span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      <footer className="p-6 text-center text-sm text-gray-700">
        © 2026 LearnEarn 360
      </footer>
    </div>
  );
}
