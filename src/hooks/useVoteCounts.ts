import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchVoteCounts, fetchAppSettings, VoteCount } from "@/services/adminService";

export const useVoteCounts = () => {
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [counts, settings] = await Promise.all([
      fetchVoteCounts(),
      fetchAppSettings()
    ]);
    
    setVoteCounts(counts);
    setIsVisible(settings.leaderboard_visible ?? true);
    setIsFrozen(settings.leaderboard_frozen ?? false);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Set up realtime subscription for votes
    const channel = supabase
      .channel('votes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes'
        },
        () => {
          // Reload vote counts when votes change
          if (!isFrozen) {
            fetchVoteCounts().then(setVoteCounts);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isFrozen]);

  return { voteCounts, isVisible, isFrozen, loading, refresh: loadData };
};
