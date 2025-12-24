import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, User, Lock } from "lucide-react";
import { useVoteCounts } from "@/hooks/useVoteCounts";
import { fetchCategories, fetchContestants, Category, Contestant } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";

const Leaderboard = () => {
  const { voteCounts, isVisible, loading: countsLoading } = useVoteCounts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [cats, cons] = await Promise.all([
        fetchCategories(),
        fetchContestants()
      ]);
      setCategories(cats.filter(c => c.is_active));
      setContestants(cons.filter(c => c.is_active));
      setLoading(false);
    };
    loadData();
  }, []);

  const getContestantVotes = (categoryId: string, contestantId: string) => {
    const count = voteCounts.find(
      vc => vc.category_id === categoryId && vc.nominee_id === contestantId
    );
    return count?.vote_count || 0;
  };

  const getRankedContestants = (categoryId: string) => {
    const categoryContestants = contestants.filter(c => c.category_id === categoryId);
    return categoryContestants
      .map(c => ({
        ...c,
        votes: getContestantVotes(categoryId, c.id)
      }))
      .sort((a, b) => b.votes - a.votes);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-accent" />;
      case 1:
        return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 2:
        return <Award className="w-5 h-5 text-primary" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm text-muted-foreground">{index + 1}</span>;
    }
  };

  const getRankClass = (index: number) => {
    switch (index) {
      case 0:
        return "bg-accent/10 border-accent/30";
      case 1:
        return "bg-muted/30 border-muted-foreground/30";
      case 2:
        return "bg-primary/10 border-primary/30";
      default:
        return "";
    }
  };

  if (!isVisible) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-dark">
        <Header />
        <main className="flex-1 pt-24 md:pt-28 pb-12 px-4 flex items-center justify-center">
          <Card className="max-w-md w-full bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-display text-2xl mb-2">Leaderboard Hidden</h2>
              <p className="text-muted-foreground">
                The leaderboard is currently not visible. Check back later!
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <Header />

      <main className="flex-1 pt-24 md:pt-28 pb-12 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
              LIVE <span className="text-gradient-gold">LEADERBOARD</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              See who's leading in each category. Rankings update in real-time as votes come in.
            </p>
          </div>

          {/* Categories Grid */}
          {loading || countsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <Skeleton className="h-8 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-14 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category, catIndex) => {
                const rankedContestants = getRankedContestants(category.id);
                const totalVotes = rankedContestants.reduce((sum, c) => sum + c.votes, 0);

                return (
                  <Card 
                    key={category.id} 
                    className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-up"
                    style={{ animationDelay: `${catIndex * 0.1}s` }}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="font-display text-xl flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        {category.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {rankedContestants.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-4 text-center">
                          No contestants in this category
                        </p>
                      ) : (
                        rankedContestants.map((contestant, index) => {
                          const percentage = totalVotes > 0 
                            ? Math.round((contestant.votes / totalVotes) * 100) 
                            : 0;

                          return (
                            <div
                              key={contestant.id}
                              className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all ${getRankClass(index)}`}
                            >
                              {/* Rank */}
                              <div className="flex-shrink-0 w-8 flex justify-center">
                                {getRankIcon(index)}
                              </div>

                              {/* Avatar */}
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                                {contestant.image_url ? (
                                  <img
                                    src={contestant.image_url}
                                    alt={contestant.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>

                              {/* Name & Votes */}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{contestant.name}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">
                                    {contestant.votes} vote{contestant.votes !== 1 ? 's' : ''}
                                  </span>
                                  {percentage > 0 && (
                                    <span className="text-xs text-muted-foreground/70">
                                      ({percentage}%)
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Progress bar background */}
                              {index < 3 && percentage > 0 && (
                                <div 
                                  className="absolute bottom-0 left-0 h-1 rounded-b-lg bg-gradient-to-r from-accent/50 to-primary/50"
                                  style={{ width: `${percentage}%` }}
                                />
                              )}
                            </div>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
