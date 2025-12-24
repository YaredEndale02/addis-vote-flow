import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  Category 
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

const AdminCategoriesTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    icon: "🏆",
    display_order: 0,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      icon: "🏆",
      display_order: categories.length,
      is_active: true,
    });
    setSelectedCategory(null);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || "",
      icon: category.icon || "🏆",
      display_order: category.display_order || 0,
      is_active: category.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (selectedCategory) {
      const { id, ...updates } = formData;
      const result = await updateCategory(selectedCategory.id, updates);
      if (result.success) {
        toast.success("Category updated");
        await loadData();
        setDialogOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to update");
      }
    } else {
      const result = await createCategory(formData);
      if (result.success) {
        toast.success("Category created");
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
    if (!selectedCategory) return;

    const result = await deleteCategory(selectedCategory.id);
    if (result.success) {
      toast.success("Category deleted");
      await loadData();
    } else {
      toast.error(result.error || "Failed to delete");
    }
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Categories</h2>
          <p className="text-muted-foreground text-sm">{categories.length} total</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {selectedCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!selectedCategory && (
                <div className="space-y-2">
                  <Label htmlFor="id">ID (slug)</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="best-game"
                    required
                    className="bg-background/50"
                  />
                </div>
              )}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (emoji)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="bg-background/50"
                    maxLength={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="bg-background/50"
                  />
                </div>
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
                ) : selectedCategory ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <div className="grid gap-3">
        {categories.map((category) => (
          <Card key={category.id} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{category.name}</p>
                    {!category.is_active && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {category.description || "No description"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedCategory(category);
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
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This will also delete all contestants and votes in this category. This action cannot be undone.
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

export default AdminCategoriesTab;
