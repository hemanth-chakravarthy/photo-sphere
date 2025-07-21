import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Edit2, Star, StarOff, Image, MapPin, Tag } from "lucide-react";
import { usePhotos, Photo } from "@/hooks/usePhotos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const PhotoManager = () => {
  const { photos, loading, error, deletePhoto, updatePhoto, refetch } = usePhotos();
  const { toast } = useToast();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    description: "",
    category: "",
    tags: "",
    featured: false,
  });

  const openEditDialog = (photo: Photo) => {
    setSelectedPhoto(photo);
    setEditForm({
      title: photo.title,
      location: photo.location || "",
      description: photo.description || "",
      category: photo.category || "",
      tags: photo.tags?.join(", ") || "",
      featured: photo.featured || false,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedPhoto) return;

    const success = await updatePhoto(selectedPhoto.id, {
      title: editForm.title,
      location: editForm.location || null,
      description: editForm.description || null,
      category: editForm.category || null,
      tags: editForm.tags ? editForm.tags.split(",").map(tag => tag.trim()) : null,
      featured: editForm.featured,
    });

    if (success) {
      toast({
        title: "Photo updated",
        description: "Photo details have been updated successfully.",
      });
      setIsEditDialogOpen(false);
      refetch();
    } else {
      toast({
        title: "Error",
        description: "Failed to update photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPhoto) return;

    const success = await deletePhoto(selectedPhoto.id);

    if (success) {
      toast({
        title: "Photo deleted",
        description: "Photo has been removed from your gallery.",
      });
      setIsDeleteDialogOpen(false);
      refetch();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (photo: Photo) => {
    const success = await updatePhoto(photo.id, {
      featured: !photo.featured,
    });

    if (success) {
      toast({
        title: photo.featured ? "Removed from featured" : "Added to featured",
        description: photo.featured 
          ? "Photo is no longer featured" 
          : "Photo is now featured on the homepage",
      });
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="text-center text-photosphere-600">
        Loading your photos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading photos: {error}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center text-photosphere-600">
        <Image size={64} className="mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No photos uploaded yet</h3>
        <p>Upload your first photo to get started!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif text-photosphere-800">
          Manage Photos ({photos.length})
        </h2>
        <Button onClick={refetch} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleFeatured(photo)}
                      className="p-2 h-8 w-8"
                    >
                      {photo.featured ? (
                        <Star className="h-3 w-3 fill-current" />
                      ) : (
                        <StarOff className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditDialog(photo)}
                      className="p-2 h-8 w-8"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteDialog(photo)}
                      className="p-2 h-8 w-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {photo.featured && (
                  <Badge className="absolute top-2 left-2">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-photosphere-800 truncate">
                  {photo.title}
                </h3>
                {photo.location && (
                  <p className="text-sm text-photosphere-600 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {photo.location}
                  </p>
                )}
                {photo.category && (
                  <Badge variant="secondary" className="mt-2">
                    {photo.category}
                  </Badge>
                )}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex items-center mt-2 text-xs text-photosphere-500">
                    <Tag className="h-3 w-3 mr-1" />
                    {photo.tags.slice(0, 2).join(", ")}
                    {photo.tags.length > 2 && ` +${photo.tags.length - 2}`}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
            <DialogDescription>
              Update the details for this photo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={editForm.category}
                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={editForm.tags}
                onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-featured"
                checked={editForm.featured}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, featured: checked === true }))}
              />
              <Label htmlFor="edit-featured">Featured Photo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPhoto?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PhotoManager;