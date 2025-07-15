
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image, MapPin, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const PhotoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      // Create image element to get dimensions
      const img = new Image();
      img.onload = async () => {
        // Save photo metadata to database
        const { error: dbError } = await supabase
          .from('photos')
          .insert({
            title,
            location: location || null,
            description: description || null,
            src: publicUrl,
            alt: title,
            width: img.width,
            height: img.height,
            featured,
            category: category || null,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : null,
          });

        if (dbError) throw dbError;

        // Reset form
        setFile(null);
        setPreview(null);
        setTitle("");
        setLocation("");
        setDescription("");
        setTags("");
        setCategory("");
        setFeatured(false);
        setUploadSuccess(true);
        
        setTimeout(() => setUploadSuccess(false), 3000);
      };
      
      img.src = publicUrl;
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-photosphere-800">
            <Upload size={24} />
            Upload New Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Photo File</Label>
            {!file ? (
              <div className="border-2 border-dashed border-photosphere-200 rounded-lg p-8 text-center hover:border-photosphere-300 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Image size={48} className="text-photosphere-400" />
                  <p className="text-photosphere-600">Click to upload a photo</p>
                  <p className="text-sm text-photosphere-400">PNG, JPG, JPEG up to 10MB</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview!}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Photo Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter photo title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-photosphere-500" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Photo location"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., landscape, nature, portrait"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-photosphere-500" />
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="mountain, sunset, nature (comma-separated)"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your photo..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
            />
            <Label htmlFor="featured">Featured Photo</Label>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || !title || isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload Photo"}
          </Button>

          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-100 text-green-800 rounded-lg text-center"
            >
              Photo uploaded successfully!
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PhotoUpload;
