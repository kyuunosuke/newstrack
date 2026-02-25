"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";

interface VerificationBadgeProps {
  isVerified: boolean;
}

export default function VerificationBadge({ isVerified }: VerificationBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all duration-200 group cursor-default"
      style={{
        backgroundColor: isVerified
          ? "rgba(212, 168, 83, 0.12)"
          : "rgba(107, 98, 85, 0.08)",
        color: isVerified ? "var(--chronos-accent)" : "var(--chronos-text-muted)",
        borderRadius: "2px",
      }}
      title={isVerified ? "Verified news source" : "Unverified source"}
    >
      {isVerified ? (
        <CheckCircle2
          className="w-3.5 h-3.5 transition-all duration-200 group-hover:drop-shadow-[0_0_4px_rgba(212,168,83,0.5)]"
          style={{ color: "var(--chronos-accent)" }}
        />
      ) : (
        <AlertTriangle
          className="w-3.5 h-3.5 transition-all duration-200 group-hover:drop-shadow-[0_0_4px_rgba(107,98,85,0.3)]"
          style={{ color: "var(--chronos-text-muted)" }}
        />
      )}
      {isVerified ? "Verified" : "Unverified"}
    </span>
  );
}
