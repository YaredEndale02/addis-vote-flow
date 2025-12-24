import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Pause, Play, Trash2, Loader2 } from "lucide-react";
import { fetchAppSettings, updateAppSetting, resetAllVotes } from "@/services/adminService";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminSettingsTab = () => {
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const loadSettings = async () => {
    const data = await fetchAppSettings();
    setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggle = async (key: string, value: boolean) => {
    setSaving(key);
    const result = await updateAppSetting(key, value);
    
    if (result.success) {
      setSettings(prev => ({ ...prev, [key]: value }));
      toast.success("Setting updated");
    } else {
      toast.error(result.error || "Failed to update");
    }
    
    setSaving(null);
  };

  const handleResetVotes = async () => {
    setResetting(true);
    const result = await resetAllVotes();
    
    if (result.success) {
      toast.success("All votes have been reset");
    } else {
      toast.error(result.error || "Failed to reset votes");
    }
    
    setResetting(false);
    setResetDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl">Settings</h2>
        <p className="text-muted-foreground text-sm">Configure leaderboard and voting options</p>
      </div>

      {/* Leaderboard Visibility */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            {settings.leaderboard_visible ? (
              <Eye className="w-5 h-5 text-accent" />
            ) : (
              <EyeOff className="w-5 h-5 text-muted-foreground" />
            )}
            Leaderboard Visibility
          </CardTitle>
          <CardDescription>
            Control whether the public leaderboard is visible to all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="leaderboard_visible" className="flex-1">
              {settings.leaderboard_visible ? "Leaderboard is visible to everyone" : "Leaderboard is hidden from public"}
            </Label>
            <Switch
              id="leaderboard_visible"
              checked={settings.leaderboard_visible ?? true}
              onCheckedChange={(checked) => handleToggle("leaderboard_visible", checked)}
              disabled={saving === "leaderboard_visible"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Freeze Updates */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            {settings.leaderboard_frozen ? (
              <Pause className="w-5 h-5 text-destructive" />
            ) : (
              <Play className="w-5 h-5 text-accent" />
            )}
            Freeze Leaderboard
          </CardTitle>
          <CardDescription>
            Stop real-time updates to the leaderboard (voting continues but display freezes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="leaderboard_frozen" className="flex-1">
              {settings.leaderboard_frozen ? "Leaderboard updates are frozen" : "Leaderboard updates in real-time"}
            </Label>
            <Switch
              id="leaderboard_frozen"
              checked={settings.leaderboard_frozen ?? false}
              onCheckedChange={(checked) => handleToggle("leaderboard_frozen", checked)}
              disabled={saving === "leaderboard_frozen"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset Votes */}
      <Card className="bg-card/50 backdrop-blur-sm border-destructive/30">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Reset All Votes
          </CardTitle>
          <CardDescription>
            Permanently delete all votes. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={() => setResetDialogOpen(true)}
            disabled={resetting}
          >
            {resetting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Votes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Reset Confirmation */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Votes</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete ALL votes from the database. Every contestant will start fresh at 0 votes. This action cannot be undone.
              <br /><br />
              <strong>Are you absolutely sure?</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetVotes} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Reset All Votes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSettingsTab;
