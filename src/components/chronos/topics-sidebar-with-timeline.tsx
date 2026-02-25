"use client";

import { Topic, TimelineEntry } from "@/types/news";
import TopicCard from "./topic-card";
import SearchFilterBar from "./search-filter-bar";
import TopicHeader from "./topic-header";
import SourceFilterChips from "./source-filter-chips";
import TimelineEntryCard from "./timeline-entry-card";
import EmptyState from "./empty-state";
import { useState, useMemo, useEffect } from "react";
import { Newspaper, X } from "lucide-react";
import { followTopic, unfollowTopic } from "@/app/actions/follow";
import { FilterType } from "@/types/news";
import { createClient } from "../../../supabase/client";

interface TopicsSidebarWithTimelineProps {
  topics: Topic[];
  initialFollows: string[];
}

export default function TopicsSidebarWithTimeline({
  topics,
  initialFollows,
}: TopicsSidebarWithTimelineProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSourceType, setSelectedSourceType] = useState<
    "all" | "verified" | "unverified" | "official"
  >("all");
  const [followedTopics, setFollowedTopics] = useState<Set<string>>(
    new Set(initialFollows)
  );
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch =
        searchQuery === "" ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || topic.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [topics, searchQuery, selectedCategory]);

  const handleFollowToggle = async (topicId: string, isFollowing: boolean) => {
    const newFollows = new Set(followedTopics);

    if (isFollowing) {
      newFollows.add(topicId);
      await followTopic(topicId);
    } else {
      newFollows.delete(topicId);
      await unfollowTopic(topicId);
    }

    setFollowedTopics(newFollows);
  };

  const handleTopicClick = async (topic: Topic) => {
    setSelectedTopic(topic);
    setIsLoadingTimeline(true);
    setActiveFilter("all");

    const supabase = createClient();
    const { data: entries } = await supabase
      .from("timeline_entries")
      .select("*")
      .eq("topic_id", topic.id)
      .order("published_at", { ascending: false });

    setTimelineEntries((entries as TimelineEntry[]) || []);
    setIsLoadingTimeline(false);
  };

  const counts = useMemo(
    () => ({
      all: timelineEntries.length,
      verified: timelineEntries.filter((e) => e.is_verified).length,
      unverified: timelineEntries.filter((e) => !e.is_verified).length,
    }),
    [timelineEntries]
  );

  const filteredEntries = useMemo(() => {
    switch (activeFilter) {
      case "verified":
        return timelineEntries.filter((e) => e.is_verified);
      case "unverified":
        return timelineEntries.filter((e) => !e.is_verified);
      default:
        return timelineEntries;
    }
  }, [timelineEntries, activeFilter]);

  const filterLabels: Record<FilterType, string> = {
    all: "",
    verified: "verified",
    unverified: "unverified",
  };

  return (
    <div className="flex w-full">
      {/* Left Sidebar - Topics List */}
      <div
        className="w-2/5 flex-shrink-0 border-r overflow-y-auto"
        style={{
          backgroundColor: "var(--chronos-bg)",
          borderColor: "var(--chronos-border)",
          height: "calc(100vh - 64px)",
        }}
      >
        <div className="px-8 py-6">
          <SearchFilterBar
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onSourceTypeChange={setSelectedSourceType}
            selectedCategory={selectedCategory}
            selectedSourceType={selectedSourceType}
          />

          <div className="flex items-center gap-3 mb-6 mt-6">
            <div
              className="w-[3px] h-6 rounded-full"
              style={{ backgroundColor: "var(--chronos-accent)" }}
            />
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--chronos-text)" }}
            >
              {selectedCategory === "All"
                ? "Topics"
                : `${selectedCategory}`}
            </h2>
            <span
              className="text-xs font-light"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              ({filteredTopics.length})
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {filteredTopics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTopic?.id === topic.id ? "ring-2" : ""
                }`}
                style={{
                  ringColor:
                    selectedTopic?.id === topic.id
                      ? "var(--chronos-accent)"
                      : "transparent",
                }}
              >
                <TopicCard
                  topic={topic}
                  index={index}
                  isFollowing={followedTopics.has(topic.id)}
                  onFollowToggle={handleFollowToggle}
                  disableLink={true}
                />
              </div>
            ))}

            {filteredTopics.length === 0 && (
              <div
                className="text-center py-12 rounded"
                style={{
                  backgroundColor: "var(--chronos-card)",
                  border: "1px dashed var(--chronos-border)",
                  borderRadius: "4px",
                }}
              >
                <Newspaper
                  className="w-12 h-12 mx-auto mb-3 opacity-40"
                  style={{ color: "var(--chronos-text-muted)" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "var(--chronos-text-muted)" }}
                >
                  No topics found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Timeline View */}
      <div
        className="w-3/5"
        style={{
          backgroundColor: "var(--chronos-bg)",
          height: "calc(100vh - 64px)",
        }}
      >
        {selectedTopic ? (
          <div className="px-10 py-6 paper-texture relative z-10">
            <div className="flex items-start justify-between mb-6">
              <TopicHeader
                topic={selectedTopic}
                filteredCount={filteredEntries.length}
              />
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-2 rounded hover:bg-opacity-10 transition-all"
                style={{
                  backgroundColor: "rgba(212,168,83,0.1)",
                }}
              >
                <X
                  className="w-5 h-5"
                  style={{ color: "var(--chronos-accent)" }}
                />
              </button>
            </div>

            <div className="mb-8">
              <SourceFilterChips
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={counts}
              />
            </div>

            {isLoadingTimeline ? (
              <div className="text-center py-16">
                <div
                  className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: "var(--chronos-accent)",
                    borderTopColor: "transparent",
                  }}
                />
                <p
                  className="mt-4 text-sm"
                  style={{ color: "var(--chronos-text-muted)" }}
                >
                  Loading timeline...
                </p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <EmptyState filterLabel={filterLabels[activeFilter]} />
            ) : (
              <div className="relative">
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
        ) : (
          <div
            className="flex items-center justify-center"
            style={{ height: "100%" }}
          >
            <div className="text-center max-w-md px-4">
              <Newspaper
                className="w-16 h-16 mx-auto mb-4 opacity-30"
                style={{ color: "var(--chronos-accent)" }}
              />
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--chronos-text)" }}
              >
                Select a topic to view timeline
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--chronos-text-muted)" }}
              >
                Click on any topic from the left sidebar to explore its
                chronological timeline of news sources.
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
