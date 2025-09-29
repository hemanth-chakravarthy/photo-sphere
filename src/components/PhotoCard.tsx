
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Photo } from "@/hooks/usePhotos";
import WatermarkedImage from "@/components/WatermarkedImage";
import { useFavorites } from "@/hooks/useFavorites";

interface PhotoCardProps {
  photo: Photo;
  priority?: boolean;
  className?: string;
  onClick?: (photo: Photo) => void;
}

const PhotoCard = ({ photo, priority = false, className, onClick }: PhotoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleFavorite, isFavorited } = useFavorites();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(photo.id);
  };

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
      <div className="overflow-hidden relative rounded-md bg-photosphere-100" style={{ aspectRatio: `${photo.width}/${photo.height}` }}>
        <WatermarkedImage
          src={photo.src}
          alt={photo.alt}
          loading={priority ? "eager" : "lazy"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          priority={priority}
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
            onClick={handleFavoriteClick}
            aria-label={isFavorited(photo.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={16} 
              className={cn(
                "transition-colors duration-300",
                isFavorited(photo.id) 
                  ? "text-red-500 fill-red-500" 
                  : "text-white"
              )} 
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoCard;
