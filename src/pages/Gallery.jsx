
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import { photos } from "@/data/photos";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const Gallery = () => {
  const [localPhotos, setLocalPhotos] = useState(photos);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
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

          setLocalPhotos(prev => [...prev, newPhoto]);
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-100 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h1 className="text-3xl md:text-5xl font-serif text-photosphere-800 mb-4">
              Photo Gallery
            </h1>
            <p className="text-photosphere-600 max-w-2xl mx-auto text-lg mb-8">
              Explore the world through my lens. A collection of moments captured from around the globe.
            </p>
            
            <label htmlFor="image-upload">
              <Button 
                variant="outline"
                className="gap-2"
                size="lg"
                onClick={() => document.getElementById('image-upload').click()}
              >
                <Upload size={20} />
                Upload Images
              </Button>
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </motion.div>
          
          <PhotoGrid photos={localPhotos} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
