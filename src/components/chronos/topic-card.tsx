"use client";

import { Topic } from "@/types/news";
import { Newspaper, Clock, ArrowRight, Bell, BellOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";

interface TopicCardProps {
  topic: Topic;
  index: number;
  isFollowing?: boolean;
  onFollowToggle?: (topicId: string, isFollowing: boolean) => void;
  disableLink?: boolean;
}

export default function TopicCard({ topic, index, isFollowing = false, onFollowToggle, disableLink = false }: TopicCardProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const lastUpdated = formatDistanceToNow(new Date(topic.last_updated), {
    addSuffix: true,
  });

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    const newFollowState = !following;
    setFollowing(newFollowState);
    
    if (onFollowToggle) {
      await onFollowToggle(topic.id, newFollowState);
    }
    
    setIsLoading(false);
  };

  const cardContent = (
    <div
      className="p-5 md:p-6 rounded transition-all duration-200 border cursor-pointer animate-fadeInUp"
      style={{
        backgroundColor: "var(--chronos-card)",
        boxShadow: "var(--chronos-shadow)",
        borderRadius: "4px",
        borderColor: "var(--chronos-border)",
        animationDelay: `${index * 80}ms`,
        animationFillMode: "both",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(40,30,20,0.1)";
        e.currentTarget.style.borderColor = "var(--chronos-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "var(--chronos-shadow)";
        e.currentTarget.style.borderColor = "var(--chronos-border)";
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2
          className="text-xl md:text-2xl font-bold leading-snug group-hover:opacity-80 transition-opacity duration-200 flex-1"
          style={{ color: "var(--chronos-text)" }}
        >
          {topic.title}
        </h2>
        <button
          onClick={handleFollowClick}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
          style={{
            backgroundColor: following ? "rgba(212,168,83,0.12)" : "var(--chronos-card)",
            color: following ? "var(--chronos-accent)" : "var(--chronos-text-muted)",
            border: following ? "1px solid var(--chronos-accent)" : "1px solid var(--chronos-border)",
            borderRadius: "4px",
          }}
        >
          {following ? (
            <>
              <Bell className="w-3.5 h-3.5" />
              Following
            </>
          ) : (
            <>
              <BellOff className="w-3.5 h-3.5" />
              Follow
            </>
          )}
        </button>
      </div>
      <p
        className="text-base mb-4 line-clamp-2"
        style={{
          color: "var(--chronos-text-muted)",
          lineHeight: "1.6",
        }}
      >
        {topic.summary}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div
            className="inline-flex items-center gap-1.5 text-sm font-light"
            style={{ color: "var(--chronos-text-muted)" }}
          >
            <Newspaper
              className="w-4 h-4"
              style={{ color: "var(--chronos-accent)" }}
            />
            <span>{topic.total_sources} sources</span>
          </div>
          <div
            className="inline-flex items-center gap-1.5 text-sm font-light"
            style={{ color: "var(--chronos-text-muted)" }}
          >
            <Clock
              className="w-4 h-4"
              style={{ color: "var(--chronos-accent)" }}
            />
            <span>{lastUpdated}</span>
          </div>
        </div>
        {!disableLink && (
          <div
            className="inline-flex items-center gap-1 text-sm font-medium transition-all duration-200 group-hover:gap-2"
            style={{ color: "var(--chronos-accent)" }}
          >
            View Timeline
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );

  if (disableLink) {
    return <div className="block group">{cardContent}</div>;
  }

  return (
    <Link href={`/topic/${topic.slug}`} className="block group">
      {cardContent}
    </Link>
  );
}
