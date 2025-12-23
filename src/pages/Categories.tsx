import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import VotingProgress from "@/components/VotingProgress";
import { categories } from "@/data/votingData";
import { useVotingStore } from "@/store/votingStore";

const Categories = () => {
  const getVotedCategories = useVotingStore((state) => state.getVotedCategories);
  const votedCategories = getVotedCategories();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <Header />

      <main className="flex-1 pt-24 md:pt-28 pb-12 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
              AWARD <span className="text-gradient-gold">CATEGORIES</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select a category to view nominees and cast your vote. You can vote once per category.
            </p>
          </div>

          {/* Progress */}
          <div className="max-w-3xl mx-auto mb-12">
            <VotingProgress votedCategories={votedCategories} />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CategoryCard
                  category={category}
                  hasVoted={votedCategories.includes(category.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
