import { NextResponse } from "next/server";
import {
  createPasswordResetToken,
  getPasswordResetLink,
  sendPasswordResetEmail,
} from "@/lib/password-reset";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const token = createPasswordResetToken(email);
  const resetLink = getPasswordResetLink(token);

  await sendPasswordResetEmail(email, resetLink);

  return NextResponse.json({
    message:
      "If an account with that email exists, we've sent a password reset link.",
  });
}
