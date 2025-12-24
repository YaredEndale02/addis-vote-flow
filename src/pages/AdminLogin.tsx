import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOrganizer, loading: adminLoading } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOrganizer && !adminLoading) {
      navigate("/admin/dashboard");
    }
  }, [user, isOrganizer, adminLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Check will happen via useEffect after auth state updates
    toast.success("Checking access...");
  };

  // Show checking state after login
  if (user && adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If user is logged in but not organizer
  if (user && !isOrganizer && !adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark px-4">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="font-display text-2xl mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have organizer permissions to access the dashboard.
            </p>
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark px-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50 animate-slide-up">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-display text-2xl">Organizer Login</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Access the event management dashboard
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@example.com"
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background/50"
              />
            </div>
            <Button 
              type="submit" 
              variant="hero" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to public site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
