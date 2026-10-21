import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pastEditionsData } from "@/data/pastWinnersData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Flame, Users, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const HallOfFame = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const currentEdition = pastEditionsData.find((e) => e.year === selectedYear) || pastEditionsData[0];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <Header />

      <main className="flex-1 pt-24 md:pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Hall of Fame & Past Highlights
            </div>

            <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
              LEGENDS OF <span className="text-gradient-gold">ETHIOPIAN GAMING</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Celebrating the creators, champions, and visionaries who made history in past editions of Addis Games Week.
            </p>
          </div>

          {/* Edition Selector & Stats Strip */}
          <div className="mb-12 space-y-6">
            <div className="flex items-center justify-center gap-3">
              {pastEditionsData.map((edition) => (
                <button
                  key={edition.year}
                  onClick={() => setSelectedYear(edition.year)}
                  className={`px-6 py-2.5 rounded-full text-sm font-display tracking-wider transition-all duration-300 border ${
                    selectedYear === edition.year
                      ? "bg-accent text-accent-foreground border-accent shadow-gold"
                      : "bg-secondary/40 text-muted-foreground border-border/50 hover:border-primary/40"
                  }`}
                >
                  {edition.year} AWARDS GALA
                </button>
              ))}
            </div>

            {/* Historical Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
              <div className="bg-card/40 border border-border/50 rounded-xl p-5 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-display text-foreground">{currentEdition.participatingGamers.toLocaleString()}+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Voters Participated</p>
              </div>

              <div className="bg-card/40 border border-border/50 rounded-xl p-5 text-center">
                <Flame className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-display text-foreground">{currentEdition.totalVotesCast.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Ballots Cast</p>
              </div>

              <div className="bg-card/40 border border-border/50 rounded-xl p-5 text-center">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-display text-foreground">{currentEdition.categoriesCount}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Awards Presented</p>
              </div>

              <div className="bg-card/40 border border-border/50 rounded-xl p-5 text-center">
                <ShieldCheck className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-base font-display text-foreground mt-1 truncate">{currentEdition.venue}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Ceremony Gala</p>
              </div>
            </div>
          </div>

          {/* Winners Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {currentEdition.winners.map((winner, index) => (
              <Card
                key={winner.categoryId}
                className="bg-card/60 backdrop-blur-md border border-border/60 hover:border-accent/50 transition-all duration-300 relative overflow-hidden group shadow-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Glow badge overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none group-hover:bg-accent/10 transition-colors" />

                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-xl flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-lg bg-secondary/50 border border-border/40">
                        {winner.icon}
                      </span>
                      {winner.categoryName}
                    </CardTitle>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold border border-accent/30">
                      <Trophy className="w-3.5 h-3.5" />
                      Champion
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-5 space-y-4">
                  {/* Winner Name & Details */}
                  <div>
                    <h3 className="font-display text-2xl tracking-wide text-gradient-gold group-hover:scale-[1.01] transition-transform">
                      {winner.winnerName}
                    </h3>
                    <p className="text-sm text-foreground/85 mt-1">{winner.winnerDescription}</p>
                  </div>

                  {/* Accolade Callout */}
                  <div className="bg-secondary/30 border-l-2 border-accent p-3 rounded-r-lg text-xs text-muted-foreground italic">
                    "{winner.highlight}"
                  </div>

                  {/* Vote Share Percentage */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                      <span>Public & Jury Final Share</span>
                      <span className="text-accent font-semibold">{winner.votePercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary/60 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-gold transition-all duration-1000"
                        style={{ width: `${winner.votePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Runner-Ups */}
                  <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                    <span className="font-medium">Finalists / Honorable Mentions:</span>
                    <div className="flex items-center gap-3">
                      {winner.runnerUps.map((runner) => (
                        <span key={runner.name} className="flex items-center gap-1">
                          {runner.rank === 2 ? (
                            <Medal className="w-3.5 h-3.5 text-slate-300" />
                          ) : (
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span className="text-foreground/80 font-medium">{runner.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action for Upcoming 2026 Event */}
          <div className="bg-gradient-to-r from-primary/20 via-card to-accent/10 border border-primary/40 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden shadow-glow">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs uppercase tracking-widest font-semibold">
                The Legacy Continues
              </span>
              <h2 className="font-display text-3xl md:text-5xl tracking-wide">
                WHO WILL BE CROWNED IN <span className="text-gradient-gold">2026?</span>
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                The next edition of Addis Games Week Awards is officially open. Review new candidates, support your favorite Ethiopian developers and streamers, and cast your votes today!
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/categories">
                    Vote in 2026 Awards
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/rules">Review 2026 Rules</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HallOfFame;
