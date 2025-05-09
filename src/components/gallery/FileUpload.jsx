
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const FileUpload = ({ onFileUpload, isAuthenticated }) => {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (event) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to be authenticated to upload images",
        variant: "destructive"
      });
      return;
    }

    const files = Array.from(event.target.files);
    
    if (files.length === 0) {
      return;
    }

    // Create preview objects
    const newPreviews = files.map(file => ({
      id: `preview-${Date.now()}-${file.name}`,
      name: file.name,
      file: file,
      previewUrl: URL.createObjectURL(file)
    }));

    setPreviews([...previews, ...newPreviews]);
    
    // Clear the input to allow uploading the same file again
    event.target.value = '';
  };

  const handleUpload = () => {
    if (previews.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select images to upload",
        variant: "destructive"
      });
      return;
    }

    previews.forEach(preview => {
      const file = preview.file;
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // Create a new image element to get the actual dimensions
        const img = new Image();
        img.onload = () => {
          const newPhoto = {
            id: `local-${Date.now()}-${file.name}`,
            title: file.name.split('.')[0],
            src: e.target.result,
            alt: file.name,
            width: img.width,
            height: img.height,
            location: "My Uploads"
          };

          onFileUpload(newPhoto);
        };
        
        // Set the source to load the image
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });
    
    toast({
      title: "Images uploaded",
      description: `${previews.length} image(s) have been added to the gallery`,
    });
    
    // Clear previews after upload
    setPreviews([]);
  };

  const removePreview = (previewId) => {
    setPreviews(previews.filter(preview => preview.id !== previewId));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="image-upload" className="cursor-pointer">
          <Button 
            variant="outline"
            className="gap-2"
            size="lg"
          >
            <Upload size={20} />
            Select Images
          </Button>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        
        {previews.length > 0 && (
          <Button 
            onClick={handleUpload}
            variant="default"
            size="lg"
          >
            Upload {previews.length} Image{previews.length !== 1 ? 's' : ''}
          </Button>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-md mt-2">
          {previews.map(preview => (
            <div key={preview.id} className="relative border rounded-md overflow-hidden">
              <AspectRatio ratio={1} className="bg-muted">
                <img 
                  src={preview.previewUrl} 
                  alt={preview.name}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <button 
                onClick={() => removePreview(preview.id)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
