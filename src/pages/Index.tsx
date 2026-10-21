import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CountdownTimer from "@/components/CountdownTimer";
import VotingProgress from "@/components/VotingProgress";
import { useVotingStore } from "@/store/votingStore";
import { categories } from "@/data/votingData";
import { ArrowRight, Shield, Users, Trophy, Clock, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { pastEditionsData } from "@/data/pastWinnersData";

const Index = () => {
  const getVotedCategories = useVotingStore((state) => state.getVotedCategories);
  const votedCategories = getVotedCategories();
  
  // Set voting deadline for 2026 event
  const votingDeadline = new Date(2026, 11, 15, 23, 59, 59);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        
        {/* Animated Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse-slow" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              2026 Voting Now Open
            </div>

            {/* Main Title */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6">
              ADDIS GAMES WEEK
              <span className="block text-gradient-gold mt-2">AWARDS 2026</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Celebrate excellence in Ethiopian gaming. Vote for your favorites across 
              <span className="text-accent font-semibold"> 8 categories</span> and help crown the next generation of gaming pioneers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button variant="hero" size="xl" asChild>
                <Link to="/categories">
                  Vote in 2026 Awards
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/hall-of-fame">
                  <Trophy className="w-4 h-4 mr-2 text-accent" />
                  2024 Hall of Fame
                </Link>
              </Button>
            </div>

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                Voting Ends In
              </p>
              <CountdownTimer targetDate={votingDeadline} />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section (if user has voted) */}
      {votedCategories.length > 0 && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            <VotingProgress votedCategories={votedCategories} />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
              FAIR & TRANSPARENT VOTING
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your vote matters. We ensure every vote counts through secure and transparent processes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Secure Voting",
                description: "Advanced protection against vote manipulation and fraud",
              },
              {
                icon: Users,
                title: "One Vote Per Category",
                description: "Each voter can only submit one vote per category",
              },
              {
                icon: Trophy,
                title: "8 Categories",
                description: "Vote across diverse categories celebrating gaming excellence",
              },
              {
                icon: Clock,
                title: "Real Results",
                description: "Winners announced at the Addis Games Week ceremony",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-card border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg tracking-wide mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-2">
                AWARD CATEGORIES
              </h2>
              <p className="text-muted-foreground">
                Vote in all {categories.length} categories to have your voice heard
              </p>
            </div>
            <Button variant="gold" asChild>
              <Link to="/categories">
                View All Categories
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                to={`/vote/${category.id}`}
                className="bg-gradient-card border border-border/50 rounded-xl p-6 text-center hover:border-accent/50 hover:shadow-gold transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-display text-sm md:text-base tracking-wide group-hover:text-accent transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hall of Fame Highlights (Previous Edition) */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Previous Edition Highlights
              </div>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-2">
                2024 HALL OF <span className="text-gradient-gold">FAME</span>
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Before crowning our 2026 winners, look back at the pioneers and champions honored at the inaugural Addis Games Week Awards.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/hall-of-fame">
                View All Past Winners
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastEditionsData[0].winners.slice(0, 4).map((winner) => (
              <div
                key={winner.categoryId}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-accent/50 hover:shadow-gold transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-2 rounded-lg bg-secondary/40 border border-border/40">
                      {winner.icon}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-accent font-semibold px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                      <Trophy className="w-3 h-3" />
                      Champion
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {winner.categoryName}
                  </p>
                  <h3 className="font-display text-xl tracking-wide text-foreground mb-2">
                    {winner.winnerName}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {winner.winnerDescription}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Final Vote Share</span>
                  <span className="font-semibold text-accent">{winner.votePercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
