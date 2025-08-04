
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Photo } from "@/hooks/usePhotos";
import WatermarkedImage from "@/components/WatermarkedImage";

interface PhotoModalProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
}

const PhotoModal = ({ photo, isOpen, onClose, photos }: PhotoModalProps) => {
  const [currentPhoto, setCurrentPhoto] = useState<Photo>(photo);
  const [isLoading, setIsLoading] = useState(true);

  // Find current photo index
  const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowLeft":
          navigatePrevious();
          break;
        case "ArrowRight":
          navigateNext();
          break;
        case "Escape":
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, photos]);

  // Update current photo when prop changes
  useEffect(() => {
    setCurrentPhoto(photo);
  }, [photo]);

  // Reset loading state when photo changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentPhoto]);

  // Navigate to previous photo
  const navigatePrevious = () => {
    if (currentIndex > 0) {
      setCurrentPhoto(photos[currentIndex - 1]);
    } else {
      setCurrentPhoto(photos[photos.length - 1]);
    }
  };

  // Navigate to next photo
  const navigateNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentPhoto(photos[currentIndex + 1]);
    } else {
      setCurrentPhoto(photos[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-50 p-2 text-white bg-black/30 rounded-full hover:bg-black/50 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button
            className="absolute left-4 z-40 p-3 text-white bg-black/30 rounded-full hover:bg-black/50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigatePrevious();
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next button */}
          <button
            className="absolute right-4 z-40 p-3 text-white bg-black/30 rounded-full hover:bg-black/50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigateNext();
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image container */}
          <div
            className="w-full h-full flex items-center justify-center p-4 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhoto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl max-h-full relative"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                <WatermarkedImage
                  src={currentPhoto.src}
                  alt={currentPhoto.alt}
                  className="max-w-full max-h-[80vh] object-contain shadow-xl"
                  onLoad={() => setIsLoading(false)}
                  priority={true}
                />

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <h2 className="text-xl font-medium font-serif">{currentPhoto.title}</h2>
                  {currentPhoto.location && (
                    <p className="text-sm text-white/80 mt-1">{currentPhoto.location}</p>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: currentPhoto.title,
                          text: currentPhoto.description || currentPhoto.title,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        // You could add a toast here to show copy success
                      }
                    }}
                    className="p-2 text-white bg-black/30 rounded-full hover:bg-black/50 transition-colors"
                    aria-label="Share photo"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoModal;
