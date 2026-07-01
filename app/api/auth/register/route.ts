import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/resend";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const [existingEmail, existingUsername] = await Promise.all([
      db.user.findUnique({ where: { email: data.email } }),
      db.user.findUnique({ where: { username: data.username } }),
    ]);

    if (existingEmail) return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    if (existingUsername) return NextResponse.json({ error: "Username already taken" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: hashedPassword,
        xpTotal: 100,
        profile: { create: {} },
        xpTransactions: {
          create: { amount: 100, actionType: "account_created", description: "Welcome to LearnEarn 360! 🎉" },
        },
      },
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name || user.username).catch(console.error);

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
