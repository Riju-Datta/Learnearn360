import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BillingClient } from "@/components/settings/billing-client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Billing & Plans" };

export default async function BillingPage() {
  const session = await auth();
  const userId = session!.user.id;

  const subscription = await db.subscription.findUnique({ where: { userId } });

  return <BillingClient subscription={subscription} userPlan={session!.user.plan} />;
}
