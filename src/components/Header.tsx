import { Link, useLocation } from "react-router-dom";
import { Trophy, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/categories", label: "Categories" },
    { path: "/rules", label: "Rules" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg md:text-xl tracking-wider text-foreground">
                ADDIS GAMES WEEK
              </span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Awards 2024
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="hero" size="sm" asChild>
              <Link to="/categories">Vote Now</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium py-2 transition-colors duration-300 ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="hero" asChild className="mt-2">
                <Link to="/categories" onClick={() => setMobileMenuOpen(false)}>
                  Vote Now
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
