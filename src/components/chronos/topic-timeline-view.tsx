"use client";

import { useState, useMemo } from "react";
import { Topic, TimelineEntry, FilterType } from "@/types/news";
import TopicHeader from "./topic-header";
import SourceFilterChips from "./source-filter-chips";
import TimelineEntryCard from "./timeline-entry-card";
import EmptyState from "./empty-state";

interface TopicTimelineViewProps {
  topic: Topic;
  entries: TimelineEntry[];
}

export default function TopicTimelineView({
  topic,
  entries,
}: TopicTimelineViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const counts = useMemo(
    () => ({
      all: entries.length,
      verified: entries.filter((e) => e.is_verified).length,
      unverified: entries.filter((e) => !e.is_verified).length,
    }),
    [entries]
  );

  const filteredEntries = useMemo(() => {
    switch (activeFilter) {
      case "verified":
        return entries.filter((e) => e.is_verified);
      case "unverified":
        return entries.filter((e) => !e.is_verified);
      default:
        return entries;
    }
  }, [entries, activeFilter]);

  const filterLabels: Record<FilterType, string> = {
    all: "",
    verified: "verified",
    unverified: "unverified",
  };

  return (
    <div
      className="min-h-screen paper-texture"
      style={{ backgroundColor: "var(--chronos-bg)" }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <TopicHeader topic={topic} filteredCount={filteredEntries.length} />

        <div className="mb-8">
          <SourceFilterChips
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />
        </div>

        {filteredEntries.length === 0 ? (
          <EmptyState filterLabel={filterLabels[activeFilter]} />
        ) : (
          <div className="relative">
            {/* Timeline entries */}
            <div className="relative">
              {filteredEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="animate-fadeInUp"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <TimelineEntryCard entry={entry} index={index} />
                </div>
              ))}
            </div>

            {/* Timeline end marker */}
            <div className="flex items-center gap-6 pl-[22px] md:pl-[32px]">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: "var(--chronos-accent-light)",
                  opacity: 0.5,
                }}
              />
              <p
                className="text-sm font-light italic"
                style={{ color: "var(--chronos-text-muted)" }}
              >
                End of timeline — {filteredEntries.length} source
                {filteredEntries.length !== 1 ? "s" : ""} shown
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
