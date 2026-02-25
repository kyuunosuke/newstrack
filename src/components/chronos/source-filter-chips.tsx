"use client";

import { FilterType } from "@/types/news";

interface SourceFilterChipsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: { all: number; verified: number; unverified: number };
}

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All Sources" },
  { key: "verified", label: "Verified Only" },
  { key: "unverified", label: "Unverified Only" },
];

export default function SourceFilterChips({
  activeFilter,
  onFilterChange,
  counts,
}: SourceFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        const count = counts[filter.key];
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border cursor-pointer"
            style={{
              backgroundColor: isActive
                ? "var(--chronos-accent)"
                : "var(--chronos-card)",
              color: isActive ? "#fff" : "var(--chronos-text-muted)",
              borderColor: isActive
                ? "var(--chronos-accent)"
                : "var(--chronos-border)",
              borderRadius: "9999px",
            }}
          >
            {filter.label}
            <span
              className="text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center"
              style={{
                backgroundColor: isActive
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(107,98,85,0.08)",
                color: isActive ? "#fff" : "var(--chronos-text-muted)",
                borderRadius: "9999px",
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
