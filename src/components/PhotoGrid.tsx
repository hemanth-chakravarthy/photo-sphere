
import { useState } from "react";
import { motion } from "framer-motion";
import PhotoCard from "@/components/PhotoCard";
import PhotoModal from "@/components/PhotoModal";
import { Photo } from "@/data/photos";

interface PhotoGridProps {
  photos: Photo[];
  columns?: number;
}

const PhotoGrid = ({ photos, columns = 3 }: PhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Calculate column distribution
  const columnPhotos = Array.from({ length: columns }, () => [] as Photo[]);
  
  photos.forEach((photo, index) => {
    columnPhotos[index % columns].push(photo);
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {columnPhotos.map((column, columnIndex) => (
          <motion.div
            key={`column-${columnIndex}`}
            className="flex flex-col gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: columnIndex * 0.2 }}
          >
            {column.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                priority={columnIndex === 0}
                onClick={handlePhotoClick}
              />
            ))}
          </motion.div>
        ))}
      </div>

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
