"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

const schema = z.object({ email: z.string().email("Invalid email") });
type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSent(true);
    toast({ title: "Check your email", description: "Password reset link sent if account exists." });
  };

  if (sent) {
    return (
      <div className="bg-white/3 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your inbox</h1>
        <p className="text-gray-500 text-sm mb-6">If an account exists for that email, we've sent a reset link. Check your spam folder too.</p>
        <Link href="/login">
          <Button variant="outline" className="border-white/20 text-gray-300">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
        <p className="text-gray-500 text-sm">Enter your email and we'll send a reset link.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label className="text-gray-400 text-sm">Email address</Label>
          <Input {...register("email")} type="email" placeholder="you@example.com"
            className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting}
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 font-semibold">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Send Reset Link
        </Button>
      </form>
      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-gray-600 hover:text-gray-400 flex items-center justify-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
