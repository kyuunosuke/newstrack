"use client";

import { Topic } from "@/types/news";
import TopicCard from "./topic-card";
import SearchFilterBar from "./search-filter-bar";
import { useState, useMemo } from "react";
import { Newspaper } from "lucide-react";
import { followTopic, unfollowTopic } from "@/app/actions/follow";

interface TopicsGridProps {
  topics: Topic[];
  initialFollows: string[];
}

export default function TopicsGrid({ topics, initialFollows }: TopicsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSourceType, setSelectedSourceType] = useState<"all" | "verified" | "unverified" | "official">("all");
  const [followedTopics, setFollowedTopics] = useState<Set<string>>(new Set(initialFollows));

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
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

  return (
    <>
      <SearchFilterBar
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onSourceTypeChange={setSelectedSourceType}
        selectedCategory={selectedCategory}
        selectedSourceType={selectedSourceType}
      />

      <div className="flex items-center gap-3 mb-8 mt-8">
        <div
          className="w-[3px] h-6 rounded-full"
          style={{ backgroundColor: "var(--chronos-accent)" }}
        />
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--chronos-text)" }}
        >
          {selectedCategory === "All" ? "Trending Topics" : `${selectedCategory} Topics`}
        </h2>
        <span
          className="text-sm font-light"
          style={{ color: "var(--chronos-text-muted)" }}
        >
          ({filteredTopics.length} active)
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {filteredTopics.map((topic, index) => (
          <TopicCard 
            key={topic.id} 
            topic={topic} 
            index={index}
            isFollowing={followedTopics.has(topic.id)}
            onFollowToggle={handleFollowToggle}
          />
        ))}

        {filteredTopics.length === 0 && (
          <div
            className="text-center py-16 rounded"
            style={{
              backgroundColor: "var(--chronos-card)",
              border: "1px dashed var(--chronos-border)",
              borderRadius: "4px",
            }}
          >
            <Newspaper
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--chronos-accent-light)" }}
            />
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--chronos-text)" }}
            >
              No topics found
            </h3>
            <p
              className="text-sm font-light"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
