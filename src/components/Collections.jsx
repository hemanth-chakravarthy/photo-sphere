
import { motion } from "framer-motion";
import { collections } from "@/data/photos";
import CollectionCard from "@/components/CollectionCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Collections = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="flex justify-between items-baseline mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif text-photosphere-800">
            Collections
          </h2>
          <Link 
            to="/collections" 
            className="text-photosphere-600 hover:text-accent transition-colors flex items-center text-sm font-medium"
          >
            View all 
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.slice(0, 3).map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
