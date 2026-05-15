import { NextResponse } from "next/server";
import { consumePasswordResetToken } from "@/lib/password-reset";

export async function POST(request: Request) {
  const { token, password } = await request.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Reset token is required." }, { status: 400 });
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters long." },
      { status: 400 },
    );
  }

  const email = consumePasswordResetToken(token);

  if (!email) {
    return NextResponse.json(
      { error: "Invalid or expired reset link." },
      { status: 400 },
    );
  }

  // TODO: Persist the new password hash in your real user data store.
  console.info(`Password successfully reset for ${email}`);

  return NextResponse.json({ message: "Password reset successful." });
}
