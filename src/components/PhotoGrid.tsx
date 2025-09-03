
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import PhotoCard from "@/components/PhotoCard";
import PhotoModal from "@/components/PhotoModal";
import { Photo } from "@/hooks/usePhotos";

interface PhotoGridProps {
  photos: Photo[];
  columns?: number;
}

const PhotoGrid = ({ photos, columns = 3 }: PhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const photoId = searchParams.get("photoId");
    if (photoId && photos.length > 0) {
      const p = photos.find((ph) => ph.id === photoId);
      if (p) {
        setSelectedPhoto(p);
        setIsModalOpen(true);
      }
    }
    // Only react to searchParams and photos list changes
  }, [searchParams, photos]);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
    if (searchParams.get("photoId")) {
      searchParams.delete("photoId");
      setSearchParams(searchParams);
    }
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-max"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PhotoCard photo={photo} priority={index < 6} onClick={handlePhotoClick} />
          </motion.div>
        ))}
      </motion.div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={isModalOpen}
          onClose={closeModal}
          photos={photos}
        />
      )}
    </>
  );
};

export default PhotoGrid;
