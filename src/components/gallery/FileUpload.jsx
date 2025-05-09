
import { toast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const FileUpload = ({ onFileUpload, isAuthenticated }) => {
  const handleFileUpload = (event) => {
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
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files",
          variant: "destructive"
        });
        return;
      }

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
          toast({
            title: "Image uploaded",
            description: "Your image has been added to the gallery",
          });
        };
        
        // Set the source to load the image
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });
    
    // Clear the input to allow uploading the same file again
    event.target.value = '';
  };

  return (
    <label htmlFor="image-upload" className="cursor-pointer">
      <Button 
        variant="outline"
        className="gap-2"
        size="lg"
      >
        <Upload size={20} />
        Upload Images
      </Button>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />
    </label>
  );
};

export default FileUpload;
