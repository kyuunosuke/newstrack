"use client";

import { Topic } from "@/types/news";
import { Newspaper, Clock, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface TopicHeaderProps {
  topic: Topic;
  filteredCount: number;
}

export default function TopicHeader({ topic, filteredCount }: TopicHeaderProps) {
  const lastUpdated = formatDistanceToNow(new Date(topic.last_updated), {
    addSuffix: true,
  });

  return (
    <div className="mb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-light mb-4 transition-colors duration-200 hover:opacity-70"
        style={{ color: "var(--chronos-text-muted)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Topics
      </Link>

      <h1
        className="font-bold mb-3 leading-tight"
        style={{
          color: "var(--chronos-text)",
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: 700,
        }}
      >
        {topic.title}
      </h1>
      <p
        className="text-base mb-4 max-w-3xl"
        style={{
          color: "var(--chronos-text-muted)",
          lineHeight: "1.6",
        }}
      >
        {topic.summary}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div
          className="inline-flex items-center gap-1.5 text-sm font-light"
          style={{ color: "var(--chronos-text-muted)" }}
        >
          <Newspaper className="w-4 h-4" style={{ color: "var(--chronos-accent)" }} />
          <span>
            <strong style={{ color: "var(--chronos-text)", fontWeight: 600 }}>
              {filteredCount}
            </strong>{" "}
            of {topic.total_sources} sources shown
          </span>
        </div>
        <div
          className="inline-flex items-center gap-1.5 text-sm font-light"
          style={{ color: "var(--chronos-text-muted)" }}
        >
          <Clock className="w-4 h-4" style={{ color: "var(--chronos-accent)" }} />
          <span>Updated {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
