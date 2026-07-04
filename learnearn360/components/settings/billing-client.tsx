"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Check, Crown, Zap, Loader2, CreditCard, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

const plans = [
  {
    id: "monthly",
    name: "Premium Monthly",
    price: 19,
    interval: "month",
    description: "Billed monthly, cancel anytime",
    features: ["Unlimited rooms & courses","AI resume review","Live workshops","Mentorship sessions","Certificates","Job board access","Ad-free experience","Priority support"],
  },
  {
    id: "annual",
    name: "Premium Annual",
    price: 149,
    interval: "year",
    description: "Save 35% vs monthly billing",
    features: ["Everything in Monthly","Best value","Founding member badge","Early feature access"],
    highlight: true,
    badge: "Best Value",
  },
];

type Props = { subscription: any; userPlan: string };

export function BillingClient({ subscription, userPlan }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast({ title: "Error creating checkout", variant: "destructive" });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally { setLoading(null); }
  };

  const handlePortal = async () => {
    setLoading("portal");
    try {
      const res = await fetch("/api/subscriptions/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally { setLoading(null); }
  };

  const isPremium = userPlan === "PREMIUM" || userPlan === "LIFETIME";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current plan */}
      <div className="bg-white/3 border border-white/10 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
              isPremium ? "bg-yellow-500/20 border border-yellow-500/30" : "bg-white/5 border border-white/10")}>
              {isPremium ? <Crown className="w-5 h-5 text-yellow-400" /> : <Zap className="w-5 h-5 text-gray-500" />}
            </div>
            <div>
              <p className="font-semibold text-white">{userPlan} Plan</p>
              {subscription?.currentPeriodEnd && (
                <p className="text-xs text-gray-500">
                  {subscription.status === "CANCELLED" ? "Cancels" : "Renews"} {formatDate(subscription.currentPeriodEnd)}
                </p>
              )}
            </div>
          </div>
          {isPremium && (
            <Button variant="outline" size="sm" onClick={handlePortal} disabled={loading === "portal"}
              className="border-white/20 text-gray-400 hover:text-white gap-1.5">
              {loading === "portal" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
              Manage Billing
            </Button>
          )}
        </div>
      </div>

      {/* Upgrade plans */}
      {!isPremium && (
        <>
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Upgrade Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {plans.map((plan) => (
              <div key={plan.id} className={cn(
                "relative rounded-xl border p-6 flex flex-col",
                plan.highlight ? "bg-gradient-to-b from-blue-600/20 to-purple-600/10 border-blue-500/40" : "bg-white/3 border-white/10"
              )}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-end gap-1 mb-5">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-500 mb-1">/{plan.interval}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => handleCheckout(plan.id)} disabled={!!loading}
                  className={cn("w-full font-semibold", plan.highlight ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0" : "bg-white/10 hover:bg-white/15 text-white border-white/20")}>
                  {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                  Get {plan.name}
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 text-center">Secure payment via Stripe · 7-day free trial · Cancel anytime</p>
        </>
      )}
    </div>
  );
}
