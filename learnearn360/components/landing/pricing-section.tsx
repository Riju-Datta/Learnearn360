"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Start your journey",
    features: [
      "5 community rooms",
      "3 free courses",
      "Basic profile",
      "100 messages/month",
      "Community discussions",
      "Public events",
      "Basic gamification",
    ],
    excluded: ["AI resume review", "Certificates", "Premium courses", "Mentorship", "Job applications"],
    cta: "Get Started Free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Premium",
    price: { monthly: 19, annual: 149 },
    description: "Everything you need to grow",
    features: [
      "Unlimited rooms",
      "All 150+ courses",
      "Unlimited messaging",
      "AI resume review",
      "Shareable certificates",
      "Live workshops",
      "Mentorship sessions",
      "Premium AI tools",
      "Job board access",
      "Private networking groups",
      "Ad-free experience",
      "Priority support",
    ],
    excluded: [],
    cta: "Start Free Trial",
    href: "/register?plan=premium",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Lifetime",
    price: { monthly: 399, annual: 399 },
    description: "One payment, forever",
    features: [
      "Everything in Premium",
      "All future features",
      "Founding member badge",
      "Priority DM support",
      "Early feature access",
      "Lifetime price lock",
    ],
    excluded: [],
    cta: "Get Lifetime Access",
    href: "/register?plan=lifetime",
    highlight: false,
    badge: "Limited Offer",
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            Simple pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Invest in yourself
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Start free, upgrade when you're ready. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn("px-5 py-2 rounded-full text-sm font-medium transition-all", !annual ? "bg-white text-gray-900" : "text-gray-400")}
            >Monthly</button>
            <button
              onClick={() => setAnnual(true)}
              className={cn("px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2", annual ? "bg-white text-gray-900" : "text-gray-400")}
            >
              Annual
              <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Save 35%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={cn(
              "relative rounded-2xl border p-8 flex flex-col transition-all duration-200",
              plan.highlight
                ? "bg-gradient-to-b from-blue-600/20 to-purple-600/10 border-blue-500/40 shadow-2xl shadow-blue-500/20 scale-105"
                : "bg-white/3 border-white/10 hover:border-white/20"
            )}>
              {plan.badge && (
                <div className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold",
                  plan.highlight ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-yellow-500/20 border border-yellow-500/40 text-yellow-400"
                )}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-white">
                    ${plan.name === "Lifetime" ? 399 : annual ? Math.round(plan.price.annual / 12) : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && plan.name !== "Lifetime" && (
                    <span className="text-gray-500 mb-2">/month</span>
                  )}
                  {plan.name === "Lifetime" && <span className="text-gray-500 mb-2">one-time</span>}
                </div>
                {annual && plan.price.annual > 0 && plan.name !== "Lifetime" && (
                  <p className="text-xs text-emerald-400 mt-1">Billed ${plan.price.annual}/year</p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button className={cn(
                  "w-full h-11 font-semibold",
                  plan.highlight
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg"
                    : "bg-white/10 hover:bg-white/15 text-white border-white/20"
                )}>
                  {plan.highlight && <Zap className="w-4 h-4 mr-2" />}
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          All plans include a 7-day free trial • No credit card required for Free plan • Cancel anytime
        </p>
      </div>
    </section>
  );
}
