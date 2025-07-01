
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Image } from "lucide-react";

interface Collection {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  photoIds: string[];
}

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <motion.div 
      className="group relative rounded-lg overflow-hidden bg-white shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={collection.coverImage} 
          alt={collection.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-serif font-medium text-photosphere-800 mb-2">
          {collection.title}
        </h3>
        
        <p className="text-photosphere-600 text-sm mb-4">
          {collection.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1 text-photosphere-500 text-sm">
            <Image size={16} />
            <span>{collection.photoIds.length} photos</span>
          </div>
          
          <Link 
            to={`/collections/${collection.id}`}
            className="text-accent flex items-center text-sm font-medium group-hover:underline"
          >
            View Collection
            <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionCard;
