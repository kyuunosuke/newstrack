"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";

async function triggerTopicCrawl(topicId: string, topicTitle: string) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !serviceKey) return;

    await fetch(
      `${supabaseUrl}/functions/v1/supabase-functions-crawl-topic`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
        body: JSON.stringify({ topic_id: topicId, topic_title: topicTitle }),
      }
    );
  } catch {
    // Non-blocking — crawl failure should not block topic creation
  }
}

export const adminSignUpAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect("error", "/admin/login", "Email and password are required");
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return encodedRedirect("error", "/admin/login", error.message);
  }

  if (!data.user) {
    return encodedRedirect("error", "/admin/login", "Sign up failed — please try again");
  }

  // Grant admin privileges immediately
  const { error: insertError } = await supabase
    .from("admin_users")
    .insert({ user_id: data.user.id });

  if (insertError) {
    return encodedRedirect("error", "/admin/login", `Could not grant admin privileges: ${insertError.message}`);
  }

  // Sign in right away
  await supabase.auth.signInWithPassword({ email, password });

  return redirect("/admin");
};

export const adminSignInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect("error", "/admin/login", "Email and password are required");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/admin/login", error.message);
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", data.user.id)
    .single();

  if (!adminUser) {
    await supabase.auth.signOut();
    return encodedRedirect("error", "/admin/login", "You do not have admin privileges");
  }

  return redirect("/admin");
};

export const adminSignOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/admin/login");
};

export const checkIsAdmin = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single();
  
  return !!adminUser;
};

export const createTopicAction = async (formData: FormData) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return encodedRedirect("error", "/admin/login", "Not authenticated");
  }

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const category = formData.get("category") as string;
  const slug = formData.get("slug") as string || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (!title || !summary) {
    return encodedRedirect("error", "/admin", "Title and summary are required");
  }

  const { data: newTopic, error } = await supabase.from("topics").insert({
    title,
    summary,
    slug,
    category: category || "Technology",
    total_sources: 0,
    last_updated: new Date().toISOString(),
  }).select("id").single();

  if (error) {
    return encodedRedirect("error", "/admin", `Failed to create topic: ${error.message}`);
  }

  // Fire-and-forget: crawl the web for articles related to this topic
  if (newTopic?.id) {
    triggerTopicCrawl(newTopic.id, title);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return redirect("/admin?success=Topic created — crawling web for articles…");
};

export const updateTopicAction = async (formData: FormData) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return encodedRedirect("error", "/admin/login", "Not authenticated");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const category = formData.get("category") as string;
  const slug = formData.get("slug") as string;

  if (!id || !title || !summary) {
    return encodedRedirect("error", "/admin", "ID, title, and summary are required");
  }

  const { error } = await supabase
    .from("topics")
    .update({
      title,
      summary,
      slug,
      category: category || "Technology",
      last_updated: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return encodedRedirect("error", "/admin", `Failed to update topic: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return redirect("/admin?success=Topic updated successfully");
};

export const deleteTopicAction = async (formData: FormData) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return encodedRedirect("error", "/admin/login", "Not authenticated");
  }

  const id = formData.get("id") as string;

  if (!id) {
    return encodedRedirect("error", "/admin", "Topic ID is required");
  }

  const { error } = await supabase.from("topics").delete().eq("id", id);

  if (error) {
    return encodedRedirect("error", "/admin", `Failed to delete topic: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return redirect("/admin?success=Topic deleted successfully");
};
