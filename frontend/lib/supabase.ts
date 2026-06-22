import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Conversation {
  id: string;
  user_id: string;
  repo_url: string | null;
  title: string;
  messages: Message[];
  created_at: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function saveConversation(
  userId: string,
  repoUrl: string | null,
  messages: Message[],
  existingId?: string
): Promise<string | null> {
  const title = messages.find((m) => m.role === "user")?.content?.slice(0, 60) || "New conversation";

  if (existingId) {
    const { error } = await supabase
      .from("conversations")
      .update({ messages, title })
      .eq("id", existingId);
    if (error) console.error("Failed to update conversation:", error);
    return existingId;
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, repo_url: repoUrl, title, messages })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to save conversation:", error);
    return null;
  }
  return data.id;
}

export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch conversations:", error);
    return [];
  }
  return data || [];
}

export async function deleteConversation(id: string): Promise<void> {
  await supabase.from("conversations").delete().eq("id", id);
}
