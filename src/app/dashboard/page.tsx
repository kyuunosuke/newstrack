import DashboardNavbar from "@/components/dashboard-navbar";
import { InfoIcon, UserCircle, Bell } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import TopicCard from "@/components/chronos/topic-card";
import { Topic } from "@/types/news";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user's followed topics
  const { data: follows } = await supabase
    .from("user_follows")
    .select(`
      topic_id,
      topics (*)
    `)
    .eq("user_id", user.id);

  const followedTopics = follows?.map((f: any) => f.topics).filter(Boolean) as Topic[] || [];

  return (
    <div style={{ backgroundColor: "var(--chronos-bg)", minHeight: "100vh" }}>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-3xl">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--chronos-text)" }}
            >
              Dashboard
            </h1>
            <div
              className="text-sm p-3 px-4 rounded flex gap-2 items-center"
              style={{
                backgroundColor: "rgba(212,168,83,0.08)",
                color: "var(--chronos-text-muted)",
                borderRadius: "4px",
                border: "1px solid var(--chronos-border)",
              }}
            >
              <InfoIcon size="14" style={{ color: "var(--chronos-accent)" }} />
              <span>
                This is a protected page only visible to authenticated users
              </span>
            </div>
          </header>

          {/* Followed Topics Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Bell size={24} style={{ color: "var(--chronos-accent)" }} />
              <h2
                className="font-bold text-2xl"
                style={{ color: "var(--chronos-text)" }}
              >
                Following
              </h2>
              <span
                className="text-sm font-light"
                style={{ color: "var(--chronos-text-muted)" }}
              >
                ({followedTopics.length} topics)
              </span>
            </div>
            {followedTopics.length > 0 ? (
              <div className="flex flex-col gap-5">
                {followedTopics.map((topic, index) => (
                  <TopicCard key={topic.id} topic={topic} index={index} isFollowing={true} />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-12 rounded"
                style={{
                  backgroundColor: "var(--chronos-card)",
                  border: "1px dashed var(--chronos-border)",
                  borderRadius: "4px",
                }}
              >
                <Bell
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: "var(--chronos-accent-light)", opacity: 0.5 }}
                />
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--chronos-text)" }}
                >
                  No followed topics yet
                </h3>
                <p
                  className="text-sm font-light"
                  style={{ color: "var(--chronos-text-muted)" }}
                >
                  Start following topics from the homepage to track them here.
                </p>
              </div>
            )}
          </section>

          {/* User Profile Section */}
          <section
            className="rounded p-6 border"
            style={{
              backgroundColor: "var(--chronos-card)",
              borderColor: "var(--chronos-border)",
              boxShadow: "var(--chronos-shadow)",
              borderRadius: "4px",
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <UserCircle
                size={48}
                style={{ color: "var(--chronos-accent)" }}
              />
              <div>
                <h2
                  className="font-semibold text-xl"
                  style={{ color: "var(--chronos-text)" }}
                >
                  User Profile
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--chronos-text-muted)" }}
                >
                  {user.email}
                </p>
              </div>
            </div>
            <div
              className="rounded p-4 overflow-hidden"
              style={{
                backgroundColor: "var(--chronos-bg)",
                borderRadius: "4px",
              }}
            >
              <pre
                className="text-xs font-mono max-h-48 overflow-auto"
                style={{ color: "var(--chronos-text-muted)" }}
              >
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
