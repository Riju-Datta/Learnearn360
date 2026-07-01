import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const PRICE_MAP: Record<string, string | undefined> = {
  monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
  annual: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID,
  lifetime: process.env.STRIPE_LIFETIME_PRICE_ID,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId } = await req.json();
  const priceId = PRICE_MAP[planId];
  if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existingSub = await db.subscription.findUnique({ where: { userId: user.id } });

  let customerId = existingSub?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  const isLifetime = planId === "lifetime";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: isLifetime ? "payment" : "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    ...(isLifetime ? {} : { subscription_data: { trial_period_days: 7, metadata: { userId: user.id, planId } } }),
    metadata: { userId: user.id, planId },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
