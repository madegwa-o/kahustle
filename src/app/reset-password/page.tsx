"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      setMessage(data.message ?? data.error ?? "Request completed.");
    } catch {
      setMessage("Could not reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Create a new password with at least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="password"
              placeholder="New password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" disabled={isLoading || !token} className="w-full">
              {isLoading ? "Saving..." : "Reset password"}
            </Button>
          </form>

          {!token ? <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">Reset token is missing. Please use the link from your email.</p> : null}
          {message ? <p className="rounded-md bg-muted p-3 text-sm">{message}</p> : null}

          <p className="text-center text-sm text-muted-foreground">
            Back to <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
