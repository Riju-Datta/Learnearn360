import { Resend } from "resend";
import { render } from "@react-email/render";
import WelcomeEmail from "@/emails/templates/welcome-email";
import StreakReminderEmail from "@/emails/templates/streak-reminder-email";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "LearnEarn 360 <noreply@learnearn360.com>";

export async function sendVerificationEmail(email: string, token: string) {
  const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`;
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Verify your LearnEarn 360 account",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#3b82f6;font-size:28px;margin:0;">LearnEarn <span style="color:#10b981">360</span></h1>
          <p style="color:#64748b;margin-top:8px;">Learn Skills. Build Connections. Earn Money.</p>
        </div>
        <h2 style="font-size:22px;margin-bottom:16px;">Verify your email</h2>
        <p style="color:#94a3b8;line-height:1.6;">Click the button below to verify your email and activate your account.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${confirmUrl}" style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Verify Email</a>
        </div>
        <p style="color:#64748b;font-size:14px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Reset your LearnEarn 360 password",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:12px;">
        <h1 style="color:#3b82f6;">LearnEarn 360</h1>
        <h2>Reset your password</h2>
        <p style="color:#94a3b8;">Click below to set a new password. This link expires in 1 hour.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="background:#3b82f6;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
        </div>
        <p style="color:#64748b;font-size:14px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

/**
 * Welcome email — rendered from the React Email template in emails/templates/welcome-email.tsx
 * for richer, more maintainable markup than an inline string.
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
  const html = await render(WelcomeEmail({ name, dashboardUrl }));

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Welcome to LearnEarn 360! 🎉",
    html,
  });
}

/**
 * Streak reminder email — rendered from emails/templates/streak-reminder-email.tsx.
 * Intended to be triggered by a scheduled job (e.g. a cron-triggered API route or
 * a background worker) for users who haven't checked in by a certain hour each day.
 */
export async function sendStreakReminderEmail(email: string, name: string, streak: number) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
  const html = await render(StreakReminderEmail({ name, streak, dashboardUrl }));

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: `🔥 Don't lose your ${streak}-day streak!`,
    html,
  });
}
