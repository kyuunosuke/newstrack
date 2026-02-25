export interface Topic {
  id: string;
  title: string;
  summary: string;
  slug: string;
  category: string;
  total_sources: number;
  last_updated: string;
  created_at: string;
}

export interface TimelineEntry {
  id: string;
  topic_id: string;
  headline: string;
  excerpt: string;
  full_excerpt: string | null;
  source_name: string;
  source_logo_url: string | null;
  source_url: string;
  author: string | null;
  is_verified: boolean;
  tags: string[];
  published_at: string;
  created_at: string;
}

export type FilterType = "all" | "verified" | "unverified";
