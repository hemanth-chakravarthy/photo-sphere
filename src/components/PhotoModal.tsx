
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2, MessageCircle, Mail, Copy, Twitter, Facebook } from "lucide-react";
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
  const [showShareMenu, setShowShareMenu] = useState(false);

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
          onClick={(e) => {
            if (showShareMenu) {
              setShowShareMenu(false);
            } else {
              onClose();
            }
          }}
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
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowShareMenu(!showShareMenu);
                      }}
                      className="p-2 text-white bg-black/30 rounded-full hover:bg-black/50 transition-colors"
                      aria-label="Share photo"
                    >
                      <Share2 size={18} />
                    </button>
                    
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute right-0 top-12 bg-white rounded-lg shadow-lg py-2 min-w-[200px] z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${currentPhoto.title} - ${window.location.href}`)}`;
                            window.open(shareUrl, '_blank');
                            setShowShareMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <MessageCircle size={16} className="mr-3 text-green-600" />
                          WhatsApp
                        </button>
                        
                        <button
                          onClick={() => {
                            const shareUrl = `mailto:?subject=${encodeURIComponent(currentPhoto.title)}&body=${encodeURIComponent(`Check out this photo: ${window.location.href}`)}`;
                            window.location.href = shareUrl;
                            setShowShareMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Mail size={16} className="mr-3 text-blue-600" />
                          Email
                        </button>
                        
                        <button
                          onClick={() => {
                            const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${currentPhoto.title}`)}&url=${encodeURIComponent(window.location.href)}`;
                            window.open(shareUrl, '_blank');
                            setShowShareMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Twitter size={16} className="mr-3 text-blue-400" />
                          Twitter
                        </button>
                        
                        <button
                          onClick={() => {
                            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                            window.open(shareUrl, '_blank');
                            setShowShareMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Facebook size={16} className="mr-3 text-blue-700" />
                          Facebook
                        </button>
                        
                        <div className="border-t border-gray-200 my-1"></div>
                        
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(window.location.href);
                              // You could add a toast notification here
                              setShowShareMenu(false);
                            } catch (error) {
                              console.error('Failed to copy link:', error);
                            }
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Copy size={16} className="mr-3 text-gray-600" />
                          Copy Link
                        </button>
                      </motion.div>
                    )}
                  </div>
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
