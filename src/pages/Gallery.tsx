
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotos } from "@/hooks/usePhotos";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Gallery = () => {
  const { photos, loading, error } = usePhotos();

  return (
    <div className="min-h-screen bg-white">
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
              Photo Gallery
            </h1>
            <p className="text-photosphere-600 max-w-2xl mx-auto">
              Explore the world through my lens. A collection of moments captured from around the globe.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="text-center text-photosphere-600">
              Loading photos...
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              Error loading photos: {error}
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center text-photosphere-600">
              No photos uploaded yet. Visit the admin panel to upload your first photo!
            </div>
          ) : (
            <PhotoGrid photos={photos} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
