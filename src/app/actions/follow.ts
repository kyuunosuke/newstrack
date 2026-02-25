"use server";

import { createClient } from "../../../supabase/server";

export async function followTopic(topicId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "User not authenticated" };
  }

  const { error } = await supabase
    .from("user_follows")
    .insert({ user_id: user.id, topic_id: topicId });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function unfollowTopic(topicId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "User not authenticated" };
  }

  const { error } = await supabase
    .from("user_follows")
    .delete()
    .eq("user_id", user.id)
    .eq("topic_id", topicId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getUserFollows() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { follows: [] };
  }

  const { data } = await supabase
    .from("user_follows")
    .select("topic_id")
    .eq("user_id", user.id);

  return { follows: data?.map(f => f.topic_id) || [] };
}
