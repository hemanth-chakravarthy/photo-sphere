
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import GalleryHeader from "@/components/gallery/GalleryHeader";
import AuthenticationDialog from "@/components/gallery/AuthenticationDialog";
import { photos } from "@/data/photos";

const Gallery = () => {
  const [localPhotos, setLocalPhotos] = useState(photos);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  // Check if user was previously authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem("isPhotoSphereAdmin");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isPhotoSphereAdmin");
  };

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const handleFileUpload = (newPhoto) => {
    console.log("Adding new photo:", newPhoto);
    setLocalPhotos(prev => [newPhoto, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-20">
        <div className="container mx-auto px-6">
          <GalleryHeader
            isAuthenticated={isAuthenticated}
            onShowLoginDialog={() => setShowAuthDialog(true)}
            onLogout={handleLogout}
            onFileUpload={handleFileUpload}
          />
          
          <PhotoGrid photos={localPhotos} />
        </div>
      </main>
      
      <AuthenticationDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onAuthenticate={handleAuthentication}
      />
      
      <Footer />
    </div>
  );
};

export default Gallery;
