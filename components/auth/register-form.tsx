"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "At least 3 characters").max(20, "Max 20 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  password: z.string().min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
});
type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      toast({ title: "Registration failed", description: json.error || "Try again", variant: "destructive" });
      return;
    }
    // Auto-login
    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Start for free</h1>
        <p className="text-gray-500 text-sm">Join 12,000+ learners. No credit card needed.</p>
      </div>

      <Button type="button" variant="outline"
        className="w-full h-11 border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 mb-4"
        onClick={async () => { setGoogleLoading(true); await signIn("google", { callbackUrl: "/dashboard" }); }}
        disabled={googleLoading}>
        {googleLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Sign up with Google
      </Button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-[#030712] px-3 text-gray-600">or with email</span></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-400 text-xs">Full Name</Label>
            <Input {...register("name")} placeholder="Your name"
              className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-sm" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label className="text-gray-400 text-xs">Username</Label>
            <Input {...register("username")} placeholder="yourname"
              className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-sm" />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
          </div>
        </div>

        <div>
          <Label className="text-gray-400 text-xs">Email</Label>
          <Input {...register("email")} type="email" placeholder="you@example.com"
            className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-sm" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label className="text-gray-400 text-xs">Password</Label>
          <div className="relative mt-1">
            <Input {...register("password")} type={showPw ? "text" : "password"} placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-sm pr-10" />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {password && (
            <div className="mt-2 space-y-1">
              {Object.entries({ "8+ characters": checks.length, "Uppercase letter": checks.upper, "Number": checks.number }).map(([label, ok]) => (
                <div key={label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-emerald-400" : "text-gray-600"}`}>
                  <Check className="w-3 h-3" />{label}
                </div>
              ))}
            </div>
          )}
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 font-semibold">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Create Free Account
        </Button>

        <p className="text-xs text-gray-700 text-center">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-blue-400 hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
        </p>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  );
}
