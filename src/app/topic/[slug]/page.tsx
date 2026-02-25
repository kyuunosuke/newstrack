import ChronosNavbar from "@/components/chronos/chronos-navbar";
import ChronosFooter from "@/components/chronos/chronos-footer";
import TopicTimelineView from "@/components/chronos/topic-timeline-view";
import { createClient } from "../../../../supabase/server";
import { Topic, TimelineEntry } from "@/types/news";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: topic } = await supabase
    .from("topics")
    .select("title, summary")
    .eq("slug", slug)
    .single();

  if (!topic) {
    return { title: "Topic Not Found — Chronos News" };
  }

  return {
    title: `${topic.title} — Chronos News`,
    description: topic.summary,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: topic } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!topic) {
    notFound();
  }

  const { data: entries } = await supabase
    .from("timeline_entries")
    .select("*")
    .eq("topic_id", (topic as Topic).id)
    .order("published_at", { ascending: false })
    .limit(10);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--chronos-bg)" }}
    >
      <ChronosNavbar />
      <main className="flex-grow">
        <TopicTimelineView
          topic={topic as Topic}
          entries={(entries as TimelineEntry[]) || []}
        />
      </main>
      <ChronosFooter />
    </div>
  );
}
