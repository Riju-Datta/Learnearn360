import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      if (!userId) break;

      if (planId === "lifetime") {
        await db.user.update({ where: { id: userId }, data: { plan: "LIFETIME" } });
        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: "LIFETIME",
            interval: "LIFETIME",
            status: "ACTIVE",
            stripeCustomerId: session.customer as string,
          },
          update: { plan: "LIFETIME", status: "ACTIVE" },
        });
      } else if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await db.user.update({ where: { id: userId }, data: { plan: "PREMIUM" } });
        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: "PREMIUM",
            interval: planId === "annual" ? "ANNUAL" : "MONTHLY",
            status: sub.status === "trialing" ? "TRIALING" : "ACTIVE",
            stripeSubscriptionId: sub.id,
            stripeCustomerId: session.customer as string,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
          update: {
            status: sub.status === "trialing" ? "TRIALING" : "ACTIVE",
            stripeSubscriptionId: sub.id,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const dbSub = await db.subscription.findFirst({ where: { stripeSubscriptionId: sub.id } });
      if (dbSub) {
        const status = sub.cancel_at_period_end ? "CANCELLED" : sub.status === "active" ? "ACTIVE" : sub.status === "past_due" ? "PAST_DUE" : "ACTIVE";
        await db.subscription.update({
          where: { id: dbSub.id },
          data: {
            status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const dbSub = await db.subscription.findFirst({ where: { stripeSubscriptionId: sub.id } });
      if (dbSub) {
        await db.subscription.update({ where: { id: dbSub.id }, data: { status: "CANCELLED" } });
        await db.user.update({ where: { id: dbSub.userId }, data: { plan: "FREE" } });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const dbSub = await db.subscription.findFirst({ where: { stripeCustomerId: invoice.customer as string } });
      if (dbSub) {
        await db.subscription.update({ where: { id: dbSub.id }, data: { status: "PAST_DUE" } });
        await db.notification.create({
          data: { userId: dbSub.userId, type: "SYSTEM", title: "Payment failed", body: "Please update your payment method to keep Premium access." },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
