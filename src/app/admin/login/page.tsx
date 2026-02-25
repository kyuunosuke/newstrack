import { adminSignInAction } from "@/app/actions/admin";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import Link from "next/link";

interface AdminLoginProps {
  searchParams: Promise<Message & { error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginProps) {
  const message = await searchParams;

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-8"
      style={{ backgroundColor: "var(--chronos-bg)" }}
    >
      <div
        className="w-full max-w-md rounded-lg border p-8 shadow-sm"
        style={{
          backgroundColor: "var(--chronos-card)",
          borderColor: "var(--chronos-border)",
          boxShadow: "var(--chronos-shadow)",
        }}
      >
        <form className="flex flex-col space-y-6">
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <div
                className="rounded-full p-3"
                style={{ backgroundColor: "rgba(212,168,83,0.1)" }}
              >
                <Shield
                  className="h-8 w-8"
                  style={{ color: "var(--chronos-accent)" }}
                />
              </div>
            </div>
            <h1
              className="text-3xl font-semibold tracking-tight"
              style={{ color: "var(--chronos-text)" }}
            >
              Admin Login
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              Sign in with your admin credentials
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: "var(--chronos-text)" }}
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                className="w-full"
                style={{
                  borderColor: "var(--chronos-border)",
                  backgroundColor: "var(--chronos-bg)",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "var(--chronos-text)" }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Your password"
                required
                className="w-full"
                style={{
                  borderColor: "var(--chronos-border)",
                  backgroundColor: "var(--chronos-bg)",
                }}
              />
            </div>
          </div>

          <SubmitButton
            className="w-full font-medium"
            pendingText="Signing in..."
            formAction={adminSignInAction}
            style={{
              backgroundColor: "var(--chronos-accent)",
              color: "white",
            }}
          >
            Sign in as Admin
          </SubmitButton>

          <FormMessage message={message} />

          <div className="text-center">
            <Link
              href="/"
              className="text-sm hover:underline transition-all"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              ← Back to homepage
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
