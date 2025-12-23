import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NomineeCard from "@/components/NomineeCard";
import { Button } from "@/components/ui/button";
import { categories, nominees } from "@/data/votingData";
import { useVotingStore } from "@/store/votingStore";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const VotePage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { setVote, getVote, getVotedCategories } = useVotingStore();
  
  const category = categories.find((c) => c.id === categoryId);
  const categoryNominees = nominees.filter((n) => n.categoryId === categoryId);
  const currentVote = getVote(categoryId || "");
  const [selectedNominee, setSelectedNominee] = useState<string | null>(currentVote || null);
  const [hasConfirmed, setHasConfirmed] = useState(!!currentVote);

  // Navigation helpers
  const currentIndex = categories.findIndex((c) => c.id === categoryId);
  const prevCategory = currentIndex > 0 ? categories[currentIndex - 1] : null;
  const nextCategory = currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;
  const votedCategories = getVotedCategories();

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-dark">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl mb-4">Category Not Found</h1>
            <Button asChild>
              <Link to="/categories">Back to Categories</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleVote = (nomineeId: string) => {
    setSelectedNominee(nomineeId);
    setHasConfirmed(false);
  };

  const handleConfirmVote = () => {
    if (selectedNominee && categoryId) {
      setVote(categoryId, selectedNominee);
      setHasConfirmed(true);
      const nominee = categoryNominees.find((n) => n.id === selectedNominee);
      toast.success(`Vote confirmed for ${nominee?.name}!`, {
        description: `Your vote in "${category.name}" has been recorded.`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <Header />

      <main className="flex-1 pt-24 md:pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Link */}
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>

          {/* Category Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="text-5xl mb-4">{category.icon}</div>
            <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-3">
              {category.name}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {category.description}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                to={`/vote/${cat.id}`}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  cat.id === categoryId
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : votedCategories.includes(cat.id)
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                title={cat.name}
              >
                {votedCategories.includes(cat.id) && cat.id !== categoryId ? (
                  <Check className="w-3 h-3" />
                ) : (
                  index + 1
                )}
              </Link>
            ))}
          </div>

          {/* Nominees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categoryNominees.map((nominee, index) => (
              <div
                key={nominee.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <NomineeCard
                  nominee={nominee}
                  isSelected={selectedNominee === nominee.id}
                  onVote={handleVote}
                />
              </div>
            ))}
          </div>

          {/* Confirm Button */}
          {selectedNominee && !hasConfirmed && (
            <div className="flex justify-center mb-8 animate-fade-in">
              <Button variant="gold" size="lg" onClick={handleConfirmVote}>
                <Check className="w-5 h-5 mr-2" />
                Confirm Vote
              </Button>
            </div>
          )}

          {/* Success Message */}
          {hasConfirmed && (
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center mb-8 animate-fade-in">
              <Check className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-display text-xl tracking-wide mb-2">Vote Recorded!</h3>
              <p className="text-muted-foreground">
                Thank you for voting in {category.name}. You can change your vote until the deadline.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-border/50 pt-8">
            {prevCategory ? (
              <Button variant="outline" asChild>
                <Link to={`/vote/${prevCategory.id}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {prevCategory.name}
                </Link>
              </Button>
            ) : (
              <div />
            )}

            {nextCategory ? (
              <Button variant="default" asChild>
                <Link to={`/vote/${nextCategory.id}`}>
                  {nextCategory.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button variant="gold" asChild>
                <Link to="/thank-you">
                  Complete Voting
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VotePage;
