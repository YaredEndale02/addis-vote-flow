import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";
import { useVoteCounts } from "@/hooks/useVoteCounts";
import { fetchCategories, fetchContestants, Category, Contestant } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";

const AdminVotesTab = () => {
  const { voteCounts, loading: countsLoading, refresh } = useVoteCounts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [cats, cons] = await Promise.all([
        fetchCategories(),
        fetchContestants()
      ]);
      setCategories(cats);
      setContestants(cons);
      setLoading(false);
    };
    loadData();
  }, []);

  const totalVotes = voteCounts.reduce((sum, vc) => sum + vc.vote_count, 0);

  const getContestantVotes = (categoryId: string, contestantId: string) => {
    const count = voteCounts.find(
      vc => vc.category_id === categoryId && vc.nominee_id === contestantId
    );
    return count?.vote_count || 0;
  };

  const getCategoryVotes = (categoryId: string) => {
    return voteCounts
      .filter(vc => vc.category_id === categoryId)
      .reduce((sum, vc) => sum + vc.vote_count, 0);
  };

  const getContestantName = (id: string) => {
    return contestants.find(c => c.id === id)?.name || id;
  };

  if (loading || countsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Votes Cast</p>
              <p className="font-display text-4xl">{totalVotes}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Votes by Category */}
      <div className="grid gap-4">
        {categories.map((category) => {
          const categoryContestants = contestants.filter(c => c.category_id === category.id);
          const categoryVotes = getCategoryVotes(category.id);
          
          const rankedContestants = categoryContestants
            .map(c => ({
              ...c,
              votes: getContestantVotes(category.id, c.id)
            }))
            .sort((a, b) => b.votes - a.votes);

          return (
            <Card key={category.id} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    {category.name}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {categoryVotes} vote{categoryVotes !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rankedContestants.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No contestants</p>
                ) : (
                  <div className="space-y-2">
                    {rankedContestants.map((contestant, index) => {
                      const percentage = categoryVotes > 0 
                        ? Math.round((contestant.votes / categoryVotes) * 100) 
                        : 0;

                      return (
                        <div
                          key={contestant.id}
                          className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
                        >
                          <span className="w-6 text-center text-muted-foreground">
                            {index === 0 && contestant.votes > 0 ? (
                              <Trophy className="w-4 h-4 text-accent mx-auto" />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{contestant.name}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{contestant.votes}</span>
                            {percentage > 0 && (
                              <span className="text-muted-foreground">({percentage}%)</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminVotesTab;
