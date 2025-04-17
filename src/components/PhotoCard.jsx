
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const PhotoCard = ({ photo, priority = false, className, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-md group cursor-pointer",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(photo)}
      whileHover={{ y: -5 }}
    >
      <div className="overflow-hidden relative rounded-md bg-photosphere-100">
        <img
          src={photo.src}
          alt={photo.alt}
          loading={priority ? "eager" : "lazy"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-photosphere-950/80 to-transparent p-4 flex flex-col justify-end transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="text-white">
            <h3 className="text-lg font-medium font-serif">{photo.title}</h3>
            
            {photo.location && (
              <p className="flex items-center text-sm text-white/80 mt-1">
                <MapPin size={14} className="mr-1" />
                {photo.location}
              </p>
            )}
          </div>
        </div>

        <div className="absolute top-3 right-3 flex space-x-2">
          <button 
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
              isHovered ? "opacity-100 bg-white/20 backdrop-blur-sm" : "opacity-0"
            )}
            aria-label="Like photo"
          >
            <Heart size={16} className="text-white" />
          </button>
          <button 
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
              isHovered ? "opacity-100 bg-white/20 backdrop-blur-sm" : "opacity-0"
            )}
            aria-label="Share photo"
          >
            <Share2 size={16} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoCard;
