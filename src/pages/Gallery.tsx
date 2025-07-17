
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import PhotoModal from "@/components/PhotoModal";
import Scene3D from "@/components/3D/Scene3D";
import PhotoGallery3D from "@/components/3D/PhotoGallery3D";
import FloatingElements from "@/components/3D/FloatingElements";
import { photos, Photo } from "@/data/photos";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Gallery = () => {
  const [view3D, setView3D] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Scene3D className="h-full w-full" enableZoom={false} enablePan={false} autoRotate>
          <FloatingElements count={6} />
        </Scene3D>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h1 className="text-3xl md:text-4xl font-serif text-photosphere-800 mb-4">
                {view3D ? "3D Gallery Experience" : "Photo Gallery"}
              </h1>
              <p className="text-photosphere-600 max-w-2xl mx-auto mb-6">
                Explore the world through my lens. A collection of moments captured from around the globe.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => setView3D(false)} 
                  variant={!view3D ? "default" : "outline"}
                >
                  2D Grid View
                </Button>
                <Button 
                  onClick={() => setView3D(true)} 
                  variant={view3D ? "default" : "outline"}
                >
                  3D Gallery View
                </Button>
              </div>
            </motion.div>
            
            {view3D ? (
              <div className="h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                <Scene3D className="h-full" cameraPosition={[0, 5, 15]}>
                  <PhotoGallery3D photos={photos} onPhotoClick={handlePhotoClick} />
                </Scene3D>
              </div>
            ) : (
              <PhotoGrid photos={photos} />
            )}
          </div>
        </main>
        
        <Footer />
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={isModalOpen}
          onClose={closeModal}
          photos={photos}
        />
      )}
    </div>
  );
};

export default Gallery;
