import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VotingState {
  votes: Record<string, string>; // categoryId -> nomineeId
  setVote: (categoryId: string, nomineeId: string) => void;
  getVote: (categoryId: string) => string | undefined;
  getVotedCategories: () => string[];
  clearVotes: () => void;
}

export const useVotingStore = create<VotingState>()(
  persist(
    (set, get) => ({
      votes: {},
      setVote: (categoryId, nomineeId) =>
        set((state) => ({
          votes: { ...state.votes, [categoryId]: nomineeId },
        })),
      getVote: (categoryId) => get().votes[categoryId],
      getVotedCategories: () => Object.keys(get().votes),
      clearVotes: () => set({ votes: {} }),
    }),
    {
      name: "agw-votes",
    }
  )
);
