
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import { photos } from "@/data/photos";
import { motion } from "framer-motion";
import { Upload, Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Gallery = () => {
  const [localPhotos, setLocalPhotos] = useState(photos);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  // This would typically be stored securely on a backend
  // For demo purposes we're using a hardcoded password
  const ADMIN_PASSWORD = "photosphere123";

  const handleAuthentication = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowAuthDialog(false);
      localStorage.setItem("isPhotoSphereAdmin", "true");
      toast({
        title: "Authentication successful",
        description: "You can now upload images",
      });
    } else {
      toast({
        title: "Authentication failed",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
    setPassword("");
  };

  // Check if user was previously authenticated
  useState(() => {
    if (localStorage.getItem("isPhotoSphereAdmin") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isPhotoSphereAdmin");
    toast({
      title: "Logged out",
      description: "You have been logged out",
    });
  };

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
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <label htmlFor="image-upload">
                  <Button 
                    variant="outline"
                    className="gap-2"
                    size="lg"
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
                
                <Button 
                  variant="ghost"
                  className="gap-2"
                  size="lg"
                  onClick={handleLogout}
                >
                  <LockOpen size={20} />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline"
                className="gap-2"
                size="lg"
                onClick={() => setShowAuthDialog(true)}
              >
                <Lock size={20} />
                Admin Login
              </Button>
            )}
          </motion.div>
          
          <PhotoGrid photos={localPhotos} />
        </div>
      </main>
      
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              Enter your password to access admin functions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAuthentication();
                  }
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                onClick={handleAuthentication}
              >
                Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Gallery;
