"use client";

import { Topic } from "@/types/news";
import { deleteTopicAction } from "@/app/actions/admin";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Newspaper, Clock, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import TopicForm from "./topic-form";
import { createClient } from "@supabase/supabase-js";

interface AdminTopicsTableProps {
  topics: Topic[];
  successMessage?: string;
}

export default function AdminTopicsTable({
  topics,
  successMessage,
}: AdminTopicsTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [crawlingId, setCrawlingId] = useState<string | null>(null);
  const [crawlMessage, setCrawlMessage] = useState<{ id: string; text: string; isError: boolean } | null>(null);

  const handleRecrawl = async (topic: Topic) => {
    setCrawlingId(topic.id);
    setCrawlMessage(null);
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-crawl-topic",
        { body: { topic_id: topic.id, topic_title: topic.title } }
      );
      if (error) throw error;
      setCrawlMessage({
        id: topic.id,
        text: `Crawled ${data?.inserted ?? 0} articles`,
        isError: false,
      });
      setTimeout(() => setCrawlMessage(null), 4000);
    } catch (err) {
      setCrawlMessage({
        id: topic.id,
        text: "Crawl failed — try again",
        isError: true,
      });
      setTimeout(() => setCrawlMessage(null), 4000);
    } finally {
      setCrawlingId(null);
    }
  };

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <div
          className="mb-6 p-3 px-4 rounded flex gap-2 items-center text-sm"
          style={{
            backgroundColor: "rgba(34,197,94,0.08)",
            color: "#16a34a",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "4px",
          }}
        >
          ✓ {successMessage}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--chronos-text-muted)" }}
          />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            style={{
              borderColor: "var(--chronos-border)",
              backgroundColor: "var(--chronos-bg)",
            }}
          />
        </div>
        <Button
          onClick={() => {
            setEditingTopic(null);
            setShowForm(true);
          }}
          className="gap-2 font-medium"
          style={{
            backgroundColor: "var(--chronos-accent)",
            color: "white",
          }}
        >
          <Plus className="h-4 w-4" />
          New Topic
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-lg border p-4"
          style={{
            backgroundColor: "var(--chronos-card)",
            borderColor: "var(--chronos-border)",
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--chronos-text-muted)" }}
          >
            Total Topics
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: "var(--chronos-text)" }}
          >
            {topics.length}
          </p>
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            backgroundColor: "var(--chronos-card)",
            borderColor: "var(--chronos-border)",
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--chronos-text-muted)" }}
          >
            Total Sources
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: "var(--chronos-text)" }}
          >
            {topics.reduce((acc, t) => acc + (t.total_sources || 0), 0)}
          </p>
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            backgroundColor: "var(--chronos-card)",
            borderColor: "var(--chronos-border)",
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--chronos-text-muted)" }}
          >
            Categories
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: "var(--chronos-text)" }}
          >
            {new Set(topics.map((t) => t.category)).size}
          </p>
        </div>
      </div>

      {/* Topics List */}
      <div className="flex flex-col gap-3">
        {filteredTopics.length === 0 ? (
          <div
            className="text-center py-12 rounded"
            style={{
              backgroundColor: "var(--chronos-card)",
              border: "1px dashed var(--chronos-border)",
              borderRadius: "4px",
            }}
          >
            <Newspaper
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--chronos-accent-light)", opacity: 0.5 }}
            />
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--chronos-text)" }}
            >
              {searchQuery ? "No matching topics" : "No topics yet"}
            </h3>
            <p
              className="text-sm"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              {searchQuery
                ? "Try a different search term"
                : "Create your first topic to get started"}
            </p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-lg border p-5 transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: "var(--chronos-card)",
                borderColor:
                  deletingId === topic.id
                    ? "var(--destructive)"
                    : "var(--chronos-border)",
                boxShadow: "var(--chronos-shadow)",
                borderRadius: "4px",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="text-lg font-semibold truncate"
                      style={{ color: "var(--chronos-text)" }}
                    >
                      {topic.title}
                    </h3>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: "rgba(212,168,83,0.1)",
                        color: "var(--chronos-accent)",
                        border: "1px solid rgba(212,168,83,0.2)",
                      }}
                    >
                      {topic.category || "Technology"}
                    </span>
                  </div>
                  <p
                    className="text-sm line-clamp-2 mb-3"
                    style={{ color: "var(--chronos-text-muted)" }}
                  >
                    {topic.summary}
                  </p>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "var(--chronos-text-muted)" }}
                    >
                      <Newspaper
                        className="w-3.5 h-3.5"
                        style={{ color: "var(--chronos-accent)" }}
                      />
                      {topic.total_sources} sources
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "var(--chronos-text-muted)" }}
                    >
                      <Clock
                        className="w-3.5 h-3.5"
                        style={{ color: "var(--chronos-accent)" }}
                      />
                      {formatDistanceToNow(new Date(topic.last_updated), {
                        addSuffix: true,
                      })}
                    </div>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--chronos-text-muted)", opacity: 0.5 }}
                    >
                      /{topic.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRecrawl(topic)}
                    disabled={crawlingId === topic.id}
                    className="h-8 w-8"
                    title="Re-crawl web for articles"
                    style={{ color: crawlingId === topic.id ? "var(--chronos-accent)" : "var(--chronos-text-muted)" }}
                  >
                    <RefreshCw className={`h-4 w-4 ${crawlingId === topic.id ? "animate-spin" : ""}`} />
                  </Button>
                  {crawlMessage?.id === topic.id && (
                    <span
                      className="text-xs font-medium"
                      style={{ color: crawlMessage.isError ? "#dc2626" : "#16a34a" }}
                    >
                      {crawlMessage.text}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingTopic(topic);
                      setShowForm(true);
                    }}
                    className="h-8 w-8"
                    style={{ color: "var(--chronos-text-muted)" }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {deletingId === topic.id ? (
                    <div className="flex items-center gap-1">
                      <form>
                        <input type="hidden" name="id" value={topic.id} />
                        <SubmitButton
                          formAction={deleteTopicAction}
                          className="h-8 px-3 text-xs font-medium"
                          pendingText="..."
                          style={{
                            backgroundColor: "hsl(var(--destructive))",
                            color: "white",
                          }}
                        >
                          Confirm
                        </SubmitButton>
                      </form>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(null)}
                        className="h-8 px-2 text-xs"
                        style={{ color: "var(--chronos-text-muted)" }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingId(topic.id)}
                      className="h-8 w-8 hover:text-red-500"
                      style={{ color: "var(--chronos-text-muted)" }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Topic Form Modal */}
      {showForm && (
        <TopicForm
          topic={editingTopic}
          onClose={() => {
            setShowForm(false);
            setEditingTopic(null);
          }}
        />
      )}
    </>
  );
}
