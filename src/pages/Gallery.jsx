
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import { photos } from "@/data/photos";
import { motion } from "framer-motion";

const Gallery = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
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
            <p className="text-photosphere-600 max-w-2xl mx-auto text-lg">
              Explore the world through my lens. A collection of moments captured from around the globe.
            </p>
          </motion.div>
          
          <PhotoGrid photos={photos} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
