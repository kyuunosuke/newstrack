"use client";

import { Search, CheckCircle, AlertCircle, Newspaper } from "lucide-react";
import { useState } from "react";

interface SearchFilterBarProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onSourceTypeChange: (sourceType: "all" | "verified" | "unverified" | "official") => void;
  selectedCategory: string;
  selectedSourceType: "all" | "verified" | "unverified" | "official";
}

const categories = ["All", "Politics", "Technology", "World", "Business", "Science"];

export default function SearchFilterBar({
  onSearchChange,
  onCategoryChange,
  onSourceTypeChange,
  selectedCategory,
  selectedSourceType,
}: SearchFilterBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: "var(--chronos-text-muted)" }}
        />
        <input
          type="text"
          placeholder="Search topics, events, or sources..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-3 rounded text-base transition-all duration-200 outline-none"
          style={{
            backgroundColor: "var(--chronos-card)",
            color: "var(--chronos-text)",
            border: "1px solid var(--chronos-border)",
            borderRadius: "4px",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--chronos-accent)";
            e.target.style.boxShadow = "0 0 0 3px rgba(212,168,83,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--chronos-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-200 whitespace-nowrap"
            style={{
              backgroundColor:
                selectedCategory === category
                  ? "var(--chronos-accent)"
                  : "var(--chronos-card)",
              color:
                selectedCategory === category
                  ? "#2c2418"
                  : "var(--chronos-text)",
              border:
                selectedCategory === category
                  ? "1px solid var(--chronos-accent)"
                  : "1px solid var(--chronos-border)",
              borderRadius: "4px",
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.borderColor = "var(--chronos-accent)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.borderColor = "var(--chronos-border)";
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Source Type Filters */}
      <div className="flex items-center gap-2">
        <span
          className="text-sm font-light mr-2"
          style={{ color: "var(--chronos-text-muted)" }}
        >
          Source types:
        </span>
        <button
          onClick={() => onSourceTypeChange("verified")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200"
          style={{
            backgroundColor:
              selectedSourceType === "verified"
                ? "rgba(34,197,94,0.12)"
                : "var(--chronos-card)",
            color:
              selectedSourceType === "verified"
                ? "#16a34a"
                : "var(--chronos-text-muted)",
            border:
              selectedSourceType === "verified"
                ? "1px solid #16a34a"
                : "1px solid var(--chronos-border)",
            borderRadius: "4px",
          }}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Verified media
        </button>
        <button
          onClick={() => onSourceTypeChange("official")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200"
          style={{
            backgroundColor:
              selectedSourceType === "official"
                ? "rgba(59,130,246,0.12)"
                : "var(--chronos-card)",
            color:
              selectedSourceType === "official"
                ? "#2563eb"
                : "var(--chronos-text-muted)",
            border:
              selectedSourceType === "official"
                ? "1px solid #2563eb"
                : "1px solid var(--chronos-border)",
            borderRadius: "4px",
          }}
        >
          <Newspaper className="w-3.5 h-3.5" />
          Official source
        </button>
        <button
          onClick={() => onSourceTypeChange("unverified")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200"
          style={{
            backgroundColor:
              selectedSourceType === "unverified"
                ? "rgba(251,191,36,0.12)"
                : "var(--chronos-card)",
            color:
              selectedSourceType === "unverified"
                ? "#d97706"
                : "var(--chronos-text-muted)",
            border:
              selectedSourceType === "unverified"
                ? "1px solid #d97706"
                : "1px solid var(--chronos-border)",
            borderRadius: "4px",
          }}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          Unverified
        </button>
      </div>
    </div>
  );
}
