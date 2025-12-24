import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface Contestant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface VoteCount {
  category_id: string;
  nominee_id: string;
  vote_count: number;
}

export interface AppSetting {
  key: string;
  value: { enabled: boolean };
  updated_at: string;
}

// Check if user has organizer/admin role
export const checkIsOrganizer = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('has_role', {
    _user_id: userId,
    _role: 'organizer'
  });
  
  if (error) {
    const { data: adminData } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });
    return adminData === true;
  }
  
  return data === true;
};

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
};

// Fetch all contestants
export const fetchContestants = async (): Promise<Contestant[]> => {
  const { data, error } = await supabase
    .from("contestants")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching contestants:", error);
    return [];
  }

  return data || [];
};

// Fetch vote counts
export const fetchVoteCounts = async (): Promise<VoteCount[]> => {
  const { data, error } = await supabase.rpc('get_vote_counts');

  if (error) {
    console.error("Error fetching vote counts:", error);
    return [];
  }

  return (data || []).map((item: { category_id: string; nominee_id: string; vote_count: number }) => ({
    category_id: item.category_id,
    nominee_id: item.nominee_id,
    vote_count: Number(item.vote_count)
  }));
};

// Fetch app settings
export const fetchAppSettings = async (): Promise<Record<string, boolean>> => {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*");

  if (error) {
    console.error("Error fetching app settings:", error);
    return { leaderboard_visible: true, leaderboard_frozen: false };
  }

  const settings: Record<string, boolean> = {};
  data?.forEach((setting: AppSetting) => {
    settings[setting.key] = setting.value?.enabled ?? false;
  });

  return settings;
};

// Update app setting
export const updateAppSetting = async (
  key: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from("app_settings")
    .update({ value: { enabled } })
    .eq("key", key);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Create category
export const createCategory = async (
  category: Omit<Category, "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase.from("categories").insert(category);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Update category
export const updateCategory = async (
  id: string,
  updates: Partial<Category>
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Delete category
export const deleteCategory = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Create contestant
export const createContestant = async (
  contestant: Omit<Contestant, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase.from("contestants").insert(contestant);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Update contestant
export const updateContestant = async (
  id: string,
  updates: Partial<Contestant>
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from("contestants")
    .update(updates)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Delete contestant
export const deleteContestant = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase.from("contestants").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Reset all votes (with confirmation)
export const resetAllVotes = async (): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase.from("votes").delete().neq("id", "");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};
