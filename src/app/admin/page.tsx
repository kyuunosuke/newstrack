import AdminNavbar from "@/components/admin/admin-navbar";
import AdminTopicsTable from "@/components/admin/admin-topics-table";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { Topic } from "@/types/news";

interface AdminPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin/login");
  }

  // Check admin status
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!adminUser) {
    return redirect("/admin/login?error=not_admin");
  }

  // Fetch all topics
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .order("last_updated", { ascending: false });

  return (
    <div style={{ backgroundColor: "var(--chronos-bg)", minHeight: "100vh" }}>
      <AdminNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--chronos-text)" }}
            >
              Manage Topics
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--chronos-text-muted)" }}
            >
              Create, edit, and remove news topics from the portal
            </p>
          </header>

          {params.error && (
            <div
              className="mb-6 p-3 px-4 rounded flex gap-2 items-center text-sm"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                color: "#dc2626",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "4px",
              }}
            >
              ✕ {params.error}
            </div>
          )}

          <AdminTopicsTable
            topics={(topics as Topic[]) || []}
            successMessage={params.success}
          />
        </div>
      </main>
    </div>
  );
}
