import { supabase } from "@/integrations/supabase/client";

export interface Vote {
  id: string;
  user_id: string;
  category_id: string;
  nominee_id: string;
  created_at: string;
  updated_at: string;
}

export const fetchUserVotes = async (userId: string): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching votes:", error);
    return {};
  }

  // Convert to categoryId -> nomineeId map
  const votesMap: Record<string, string> = {};
  data?.forEach((vote) => {
    votesMap[vote.category_id] = vote.nominee_id;
  });

  return votesMap;
};

export const submitVote = async (
  userId: string,
  categoryId: string,
  nomineeId: string
): Promise<{ success: boolean; error?: string }> => {
  // Check if vote exists for this category
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", userId)
    .eq("category_id", categoryId)
    .maybeSingle();

  if (existingVote) {
    // Update existing vote
    const { error } = await supabase
      .from("votes")
      .update({ nominee_id: nomineeId })
      .eq("id", existingVote.id);

    if (error) {
      console.error("Error updating vote:", error);
      return { success: false, error: error.message };
    }
  } else {
    // Insert new vote
    const { error } = await supabase
      .from("votes")
      .insert({
        user_id: userId,
        category_id: categoryId,
        nominee_id: nomineeId,
      });

    if (error) {
      console.error("Error inserting vote:", error);
      return { success: false, error: error.message };
    }
  }

  return { success: true };
};
