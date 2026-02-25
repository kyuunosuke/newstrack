"use client";

import Link from "next/link";
import { createClient } from "../../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Shield, UserCircle, Home, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav
      className="w-full border-b py-4"
      style={{
        backgroundColor: "var(--chronos-card)",
        borderColor: "var(--chronos-border)",
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin" prefetch className="flex items-center gap-2">
            <Shield
              className="h-5 w-5"
              style={{ color: "var(--chronos-accent)" }}
            />
            <span
              className="text-xl font-bold"
              style={{ color: "var(--chronos-text)" }}
            >
              Admin Portal
            </span>
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              <Home className="h-4 w-4" />
              View Site
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle
                  className="h-6 w-6"
                  style={{ color: "var(--chronos-text-muted)" }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/admin/login");
                }}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
