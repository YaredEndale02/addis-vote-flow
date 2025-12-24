import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, BarChart3, Users, FolderOpen, Settings, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AdminVotesTab from "@/components/admin/AdminVotesTab";
import AdminContestantsTab from "@/components/admin/AdminContestantsTab";
import AdminCategoriesTab from "@/components/admin/AdminCategoriesTab";
import AdminSettingsTab from "@/components/admin/AdminSettingsTab";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isOrganizer, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState("votes");

  useEffect(() => {
    if (!loading && (!user || !isOrganizer)) {
      navigate("/admin");
    }
  }, [user, isOrganizer, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isOrganizer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Public Site</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-display text-lg tracking-wide">Organizer Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1 w-full sm:w-auto grid grid-cols-4 sm:flex">
            <TabsTrigger value="votes" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Votes</span>
            </TabsTrigger>
            <TabsTrigger value="contestants" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Contestants</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="votes" className="mt-6">
            <AdminVotesTab />
          </TabsContent>

          <TabsContent value="contestants" className="mt-6">
            <AdminContestantsTab />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <AdminCategoriesTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
