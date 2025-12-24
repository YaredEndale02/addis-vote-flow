import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, User, Loader2 } from "lucide-react";
import { 
  fetchCategories, 
  fetchContestants, 
  createContestant, 
  updateContestant, 
  deleteContestant,
  Category, 
  Contestant 
} from "@/services/adminService";
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

const AdminContestantsTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    category_id: "",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    const [cats, cons] = await Promise.all([
      fetchCategories(),
      fetchContestants()
    ]);
    setCategories(cats);
    setContestants(cons);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image_url: "",
      category_id: "",
      is_active: true,
    });
    setSelectedContestant(null);
  };

  const handleEdit = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setFormData({
      name: contestant.name,
      description: contestant.description || "",
      image_url: contestant.image_url || "",
      category_id: contestant.category_id,
      is_active: contestant.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (selectedContestant) {
      const result = await updateContestant(selectedContestant.id, formData);
      if (result.success) {
        toast.success("Contestant updated");
        await loadData();
        setDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to update");
      }
    } else {
      const result = await createContestant(formData);
      if (result.success) {
        toast.success("Contestant created");
        await loadData();
        setDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to create");
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedContestant) return;

    const result = await deleteContestant(selectedContestant.id);
    if (result.success) {
      toast.success("Contestant deleted");
      await loadData();
    } else {
      toast.error(result.error || "Failed to delete");
    }
    setDeleteDialogOpen(false);
    setSelectedContestant(null);
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || id;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Contestants</h2>
          <p className="text-muted-foreground text-sm">{contestants.length} total</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Contestant
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {selectedContestant ? "Edit Contestant" : "Add Contestant"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  required
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-background/50"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-background/50"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : selectedContestant ? (
                  "Update Contestant"
                ) : (
                  "Create Contestant"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contestants List */}
      <div className="grid gap-3">
        {contestants.map((contestant) => (
          <Card key={contestant.id} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {contestant.image_url ? (
                    <img
                      src={contestant.image_url}
                      alt={contestant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{contestant.name}</p>
                    {!contestant.is_active && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {getCategoryName(contestant.category_id)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(contestant)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedContestant(contestant);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contestant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedContestant?.name}"? This will also delete all their votes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminContestantsTab;
