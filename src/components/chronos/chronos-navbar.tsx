import Link from "next/link";
import { createClient } from "../../../supabase/server";
import UserProfile from "@/components/user-profile";
import { Clock } from "lucide-react";

export default async function ChronosNavbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav
      className="w-full border-b py-3 sticky top-0 z-50"
      style={{
        backgroundColor: "var(--chronos-card)",
        borderColor: "var(--chronos-border)",
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center gap-2 group">
          <Clock
            className="w-6 h-6 transition-colors duration-200"
            style={{ color: "var(--chronos-accent)" }}
          />
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--chronos-text)" }}
          >
            Chronos
          </span>
          <span
            className="text-sm font-light tracking-wider uppercase"
            style={{ color: "var(--chronos-text-muted)" }}
          >
            News
          </span>
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "var(--chronos-text-muted)" }}
              >
                Dashboard
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "var(--chronos-text-muted)" }}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium rounded transition-colors duration-200"
                style={{
                  backgroundColor: "var(--chronos-accent)",
                  color: "#fff",
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
