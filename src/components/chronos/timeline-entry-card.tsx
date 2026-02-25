"use client";

import { useState } from "react";
import { TimelineEntry } from "@/types/news";
import VerificationBadge from "./verification-badge";
import { ExternalLink, ChevronDown, ChevronUp, User, Tag, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface TimelineEntryCardProps {
  entry: TimelineEntry;
  index: number;
}

export default function TimelineEntryCard({ entry, index }: TimelineEntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const publishedDate = new Date(entry.published_at);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  const formattedDate = format(publishedDate, "MMM d, yyyy");
  const formattedTime = format(publishedDate, "h:mm a");

  return (
    <div
      className="relative flex gap-0 md:gap-6 group"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "both",
      }}
    >
      {/* Timeline node and connector */}
      <div className="flex flex-col items-center flex-shrink-0 w-[60px] md:w-[80px]">
        {/* Date marker */}
        <div
          className="text-center mb-2 flex-shrink-0"
          style={{ minWidth: "60px" }}
        >
          <p
            className="text-xs font-light leading-tight"
            style={{ color: "var(--chronos-text-muted)" }}
          >
            {formattedTime}
          </p>
        </div>
        {/* Circle node */}
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 border-2 transition-all duration-200 group-hover:scale-125"
          style={{
            borderColor: entry.is_verified
              ? "var(--chronos-accent)"
              : "var(--chronos-text-muted)",
            backgroundColor: entry.is_verified
              ? "var(--chronos-accent)"
              : "transparent",
          }}
        />
        {/* Vertical line */}
        <div
          className="w-[2px] flex-grow"
          style={{ backgroundColor: "var(--chronos-accent-light)" }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-grow mb-6 md:mb-8 cursor-pointer rounded transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          backgroundColor: "var(--chronos-card)",
          boxShadow: "var(--chronos-shadow)",
          borderRadius: "4px",
          border: "1px solid var(--chronos-border)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(40,30,20,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "var(--chronos-shadow)";
        }}
      >
        <div className="p-4 md:p-5">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Source info */}
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  backgroundColor: entry.is_verified
                    ? "rgba(212,168,83,0.15)"
                    : "rgba(107,98,85,0.1)",
                  color: entry.is_verified
                    ? "var(--chronos-accent)"
                    : "var(--chronos-text-muted)",
                }}
              >
                {entry.source_name.charAt(0)}
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--chronos-text)" }}
              >
                {entry.source_name}
              </span>
            </div>
            <VerificationBadge isVerified={entry.is_verified} />
            <span
              className="text-xs font-light ml-auto"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              {timeAgo}
            </span>
          </div>

          {/* Headline */}
          <h3
            className="text-lg md:text-xl font-bold mb-2 leading-snug"
            style={{ color: "var(--chronos-text)", fontSize: "clamp(18px, 2.5vw, 24px)" }}
          >
            {entry.headline}
          </h3>

          {/* Excerpt */}
          <p
            className="text-base leading-relaxed mb-3"
            style={{
              color: "var(--chronos-text-muted)",
              lineHeight: "1.6",
            }}
          >
            {isExpanded && entry.full_excerpt
              ? entry.full_excerpt
              : entry.excerpt}
          </p>

          {/* Expanded details */}
          {isExpanded && (
            <div
              className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-sm"
              style={{ borderColor: "var(--chronos-border)" }}
            >
              <div className="flex items-center gap-1.5" style={{ color: "var(--chronos-text-muted)" }}>
                <Clock className="w-3.5 h-3.5" />
                <span className="font-light">{formattedDate} at {formattedTime}</span>
              </div>
              {entry.author && (
                <div className="flex items-center gap-1.5" style={{ color: "var(--chronos-text-muted)" }}>
                  <User className="w-3.5 h-3.5" />
                  <span className="font-light">{entry.author}</span>
                </div>
              )}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex items-center gap-1.5" style={{ color: "var(--chronos-text-muted)" }}>
                  <Tag className="w-3.5 h-3.5" />
                  <div className="flex gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs font-light"
                        style={{
                          backgroundColor: "rgba(212,168,83,0.08)",
                          color: "var(--chronos-text-muted)",
                          borderRadius: "2px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center justify-between mt-3 pt-2">
            <button
              className="inline-flex items-center gap-1 text-xs font-medium transition-colors duration-200"
              style={{ color: "var(--chronos-text-muted)" }}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Show more
                </>
              )}
            </button>
            <a
              href={entry.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: "var(--chronos-accent)",
                color: "#fff",
                borderRadius: "4px",
              }}
            >
              Read Full Article
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
