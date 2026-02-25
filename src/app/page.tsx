import ChronosNavbar from "@/components/chronos/chronos-navbar";
import ChronosFooter from "@/components/chronos/chronos-footer";
import TopicsSidebarWithTimeline from "@/components/chronos/topics-sidebar-with-timeline";
import { createClient } from "../../supabase/server";
import { Topic } from "@/types/news";
import { getUserFollows } from "./actions/follow";

export default async function Home() {
  const supabase = await createClient();

  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .order("last_updated", { ascending: false });

  const { follows } = await getUserFollows();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--chronos-bg)" }}
    >
      <ChronosNavbar />

      {/* Split View: Topics Sidebar + Timeline */}
      <div className="flex-grow flex">
        <TopicsSidebarWithTimeline topics={(topics as Topic[]) || []} initialFollows={follows} />
      </div>

      <ChronosFooter />

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
