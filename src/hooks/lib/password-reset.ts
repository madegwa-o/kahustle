import crypto from "node:crypto";

type PasswordResetRequest = {
  email: string;
  expiresAt: number;
};
const resetRequests = new Map<string, PasswordResetRequest>();

const RESET_WINDOW_MS = 1000 * 60 * 30; // 30 minutes

export function createPasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");

  resetRequests.set(token, {
    email,
    expiresAt: Date.now() + RESET_WINDOW_MS,
  });

  return token;
}

export function consumePasswordResetToken(token: string) {
  const request = resetRequests.get(token);

  if (!request) {
    return null;
  }

  resetRequests.delete(token);

  if (request.expiresAt < Date.now()) {
    return null;
  }

  return request.email;
}

export function getPasswordResetLink(token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${appUrl}/reset-password?token=${token}`;
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
    const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.info(`Password reset email for ${email}: ${resetLink}`);
    return;
  }

  // SMTP delivery is not wired to a transport library in this project,
  // so we keep a safe fallback until one is added.
  console.info(`SMTP configured for ${smtpHost}. Reset email for ${email}: ${resetLink}`);
}
