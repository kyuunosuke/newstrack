import Link from "next/link";
import { Clock } from "lucide-react";

export default function ChronosFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t py-10"
      style={{
        backgroundColor: "var(--chronos-card)",
        borderColor: "var(--chronos-border)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: "var(--chronos-accent)" }} />
            <span
              className="text-lg font-bold"
              style={{ color: "var(--chronos-text)" }}
            >
              Chronos News
            </span>
          </div>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-sm transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-sm transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              Terms
            </Link>
          </div>
          <p
            className="text-sm font-light"
            style={{ color: "var(--chronos-text-muted)" }}
          >
            © {currentYear} Chronos News. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
