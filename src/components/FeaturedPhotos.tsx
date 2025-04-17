
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/data/photos";
import { Link } from "react-router-dom";

interface FeaturedPhotosProps {
  photos: Photo[];
}

const FeaturedPhotos = ({ photos }: FeaturedPhotosProps) => {
  // Filter out featured photos
  const featuredPhotos = photos.filter((photo) => photo.featured);
  const [hovered, setHovered] = useState<string | null>(null);

  if (featuredPhotos.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-2xl md:text-3xl font-serif text-photosphere-800">
            Featured Work
          </h2>
          <Link 
            to="/gallery" 
            className="text-photosphere-600 hover:text-accent transition-colors flex items-center text-sm font-medium"
          >
            View all 
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              className="relative aspect-[3/4] overflow-hidden rounded-md cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHovered(photo.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <img 
                src={photo.src} 
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{
                  transform: hovered === photo.id ? "scale(1.05)" : "scale(1)"
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-photosphere-950/70 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-medium text-white font-serif">{photo.title}</h3>
                {photo.location && (
                  <p className="text-white/80 text-sm mt-1">{photo.location}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPhotos;
