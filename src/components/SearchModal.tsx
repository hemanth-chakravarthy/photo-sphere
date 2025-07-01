
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { photos } from "@/data/photos";
import { Photo } from "@/data/photos";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPhotos([]);
      return;
    }

    const filtered = photos.filter((photo) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        photo.title.toLowerCase().includes(searchLower) ||
        photo.location?.toLowerCase().includes(searchLower) ||
        photo.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    });

    setFilteredPhotos(filtered);
  }, [searchTerm]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-photosphere-800">Search Photos</h2>
                <button
                  onClick={onClose}
                  className="text-photosphere-600 hover:text-photosphere-800 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-photosphere-500" />
                <input
                  type="text"
                  placeholder="Search by title, location, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-6">
              {searchTerm.trim() === "" ? (
                <p className="text-photosphere-500 text-center">Start typing to search photos...</p>
              ) : filteredPhotos.length === 0 ? (
                <p className="text-photosphere-500 text-center">No photos found matching your search.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        onClose();
                        // Navigate to photo or open modal
                      }}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-photosphere-800 truncate">{photo.title}</h3>
                        {photo.location && (
                          <p className="text-sm text-photosphere-500 truncate">{photo.location}</p>
                        )}
                        {photo.tags && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {photo.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-photosphere-100 text-photosphere-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
