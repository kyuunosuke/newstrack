"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { Topic } from "@/types/news";
import { createTopicAction, updateTopicAction } from "@/app/actions/admin";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface TopicFormProps {
  topic?: Topic | null;
  onClose: () => void;
}

const CATEGORIES = [
  "Technology",
  "Politics",
  "Business",
  "Science",
  "World",
  "Health",
  "Sports",
  "Entertainment",
];

export default function TopicForm({ topic, onClose }: TopicFormProps) {
  const isEditing = !!topic;
  const [title, setTitle] = useState(topic?.title || "");
  const [slug, setSlug] = useState(topic?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  useEffect(() => {
    if (autoSlug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  }, [title, autoSlug]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-lg border p-6 shadow-lg max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--chronos-card)",
          borderColor: "var(--chronos-border)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--chronos-text)" }}
          >
            {isEditing ? "Edit Topic" : "Create New Topic"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            style={{ color: "var(--chronos-text-muted)" }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form className="flex flex-col space-y-4">
          {isEditing && <input type="hidden" name="id" value={topic.id} />}

          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium"
              style={{ color: "var(--chronos-text)" }}
            >
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter topic title"
              required
              style={{
                borderColor: "var(--chronos-border)",
                backgroundColor: "var(--chronos-bg)",
              }}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="slug"
              className="text-sm font-medium"
              style={{ color: "var(--chronos-text)" }}
            >
              Slug
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setAutoSlug(false);
                }}
                placeholder="auto-generated-slug"
                style={{
                  borderColor: "var(--chronos-border)",
                  backgroundColor: "var(--chronos-bg)",
                }}
              />
              {!autoSlug && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoSlug(true)}
                  className="text-xs whitespace-nowrap"
                  style={{ color: "var(--chronos-accent)" }}
                >
                  Auto
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="summary"
              className="text-sm font-medium"
              style={{ color: "var(--chronos-text)" }}
            >
              Summary *
            </Label>
            <Textarea
              id="summary"
              name="summary"
              defaultValue={topic?.summary || ""}
              placeholder="Enter topic summary"
              rows={4}
              required
              style={{
                borderColor: "var(--chronos-border)",
                backgroundColor: "var(--chronos-bg)",
              }}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-medium"
              style={{ color: "var(--chronos-text)" }}
            >
              Category
            </Label>
            <select
              id="category"
              name="category"
              defaultValue={topic?.category || "Technology"}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{
                borderColor: "var(--chronos-border)",
                backgroundColor: "var(--chronos-bg)",
                color: "var(--chronos-text)",
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              style={{
                borderColor: "var(--chronos-border)",
                color: "var(--chronos-text-muted)",
              }}
            >
              Cancel
            </Button>
            <SubmitButton
              className="flex-1 font-medium"
              pendingText={isEditing ? "Updating..." : "Creating..."}
              formAction={isEditing ? updateTopicAction : createTopicAction}
              style={{
                backgroundColor: "var(--chronos-accent)",
                color: "white",
              }}
            >
              {isEditing ? "Update Topic" : "Create Topic"}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
