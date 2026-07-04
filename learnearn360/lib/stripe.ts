import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "5 community rooms",
      "3 free courses",
      "Basic profile",
      "100 messages/month",
      "Public events",
    ],
    limits: { rooms: 5, courses: 3, messages: 100 },
  },
  PREMIUM_MONTHLY: {
    name: "Premium Monthly",
    price: 19,
    interval: "month",
    priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
    features: [
      "Unlimited rooms",
      "All courses + certificates",
      "Unlimited messaging",
      "AI resume review",
      "Live workshops",
      "Mentorship sessions",
      "Premium AI tools",
      "Ad-free experience",
      "Priority support",
    ],
    limits: { rooms: -1, courses: -1, messages: -1 },
  },
  PREMIUM_ANNUAL: {
    name: "Premium Annual",
    price: 149,
    interval: "year",
    priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
    features: [
      "Everything in Monthly",
      "Save 35% vs monthly",
      "Founding member badge",
      "Early access to new features",
    ],
    limits: { rooms: -1, courses: -1, messages: -1 },
  },
};
