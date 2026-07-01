import { Resend } from "resend";

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

export async function sendStreakReminderEmail(email: string, name: string, streak: number) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: `🔥 Don't lose your ${streak}-day streak!`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:12px;text-align:center;">
        <h1 style="color:#3b82f6;">LearnEarn 360</h1>
        <p style="font-size:48px;margin:0;">🔥</p>
        <h2>Your ${streak}-day streak is waiting!</h2>
        <p style="color:#94a3b8;">Hey ${name}, you haven't checked in today. Keep your momentum going.</p>
        <div style="margin:24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#f97316;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Continue My Streak</a>
        </div>
      </div>
    `,
  });
}
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Welcome to LearnEarn 360! 🎉",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:12px;">
        <h1 style="color:#3b82f6;">Welcome, ${name}! 🚀</h1>
        <p style="color:#94a3b8;line-height:1.6;">You've just joined thousands of learners and earners on LearnEarn 360.</p>
        <h3 style="color:#10b981;">Get started in 3 steps:</h3>
        <ol style="color:#94a3b8;line-height:2;">
          <li>Complete your profile</li>
          <li>Join your first room</li>
          <li>Set your daily goals</li>
        </ol>
        <div style="text-align:center;margin:32px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Go to Dashboard</a>
        </div>
      </div>
    `,
  });
}
