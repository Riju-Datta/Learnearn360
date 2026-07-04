"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

const schema = z.object({
  password: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Include an uppercase letter").regex(/[0-9]/, "Include a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast({ title: "Invalid reset link", variant: "destructive" });
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: data.password }),
    });
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      const json = await res.json();
      toast({ title: "Error", description: json.error, variant: "destructive" });
    }
  };

  if (!token) {
    return (
      <div className="bg-white/3 border border-white/10 rounded-2xl p-8 text-center">
        <h1 className="text-xl font-bold text-white mb-2">Invalid reset link</h1>
        <p className="text-gray-500 text-sm mb-6">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password"><Button className="bg-blue-600 hover:bg-blue-500 text-white border-0">Request new link</Button></Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-white/3 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Password reset!</h1>
        <p className="text-gray-500 text-sm">Redirecting you to sign in...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Set a new password</h1>
        <p className="text-gray-500 text-sm">Make sure it's strong and memorable</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label className="text-gray-400 text-sm">New Password</Label>
          <div className="relative mt-1.5">
            <Input {...register("password")} type={showPw ? "text" : "password"} placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 pr-10" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <Label className="text-gray-400 text-sm">Confirm Password</Label>
          <Input {...register("confirmPassword")} type={showPw ? "text" : "password"} placeholder="••••••••"
            className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 font-semibold">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Reset Password
        </Button>
      </form>
    </div>
  );
}
