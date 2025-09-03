
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Photo } from "@/hooks/usePhotos";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const { searchPhotos, loading, error } = useSearch();

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      const results = await searchPhotos(searchTerm);
      setSearchResults(results);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]); // Remove searchPhotos from dependencies to prevent re-render loop

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
                  placeholder="Search by title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  autoFocus
                />
                {loading && (
                  <Loader2 size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-photosphere-500 animate-spin" />
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-6">
              {error ? (
                <p className="text-red-500 text-center">Error: {error}</p>
              ) : searchTerm.trim() === "" ? (
                <p className="text-photosphere-500 text-center">Start typing to search photos...</p>
              ) : loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-photosphere-500" />
                  <span className="ml-2 text-photosphere-500">Searching...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-photosphere-500 text-center">No photos found matching your search.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchResults.map((photo) => (
                    <div
                      key={photo.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        navigate(`/gallery?photoId=${photo.id}`);
                        onClose();
                      }}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-photosphere-800 truncate">{photo.title}</h3>
                        {photo.category && (
                          <p className="text-sm text-photosphere-500 truncate">Category: {photo.category}</p>
                        )}
                        {photo.location && (
                          <p className="text-sm text-photosphere-500 truncate">{photo.location}</p>
                        )}
                        {photo.tags && photo.tags.length > 0 && (
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
