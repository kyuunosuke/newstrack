"use client";

import { FileX } from "lucide-react";

interface EmptyStateProps {
  filterLabel: string;
}

export default function EmptyState({ filterLabel }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center rounded"
      style={{
        backgroundColor: "var(--chronos-card)",
        border: "1px dashed var(--chronos-border)",
        borderRadius: "4px",
      }}
    >
      <FileX
        className="w-12 h-12 mb-4"
        style={{ color: "var(--chronos-accent-light)" }}
      />
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--chronos-text)" }}
      >
        No sources found
      </h3>
      <p
        className="text-sm font-light max-w-md"
        style={{ color: "var(--chronos-text-muted)" }}
      >
        No {filterLabel} sources are available for this topic yet. Try changing
        your filter selection to see other sources.
      </p>
    </div>
  );
}
