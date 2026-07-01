import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await db.subscription.findUnique({ where: { userId: session.user.id } });
  if (!subscription?.stripeSubscriptionId) return NextResponse.json({ error: "No active subscription" }, { status: 404 });

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, { cancel_at_period_end: true });
  await db.subscription.update({ where: { userId: session.user.id }, data: { cancelledAt: new Date() } });

  return NextResponse.json({ cancelled: true });
}
