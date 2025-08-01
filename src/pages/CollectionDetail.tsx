import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useCollections } from "@/hooks/usePhotos";
import PhotoGrid from "@/components/PhotoGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { collections, loading, error } = useCollections();
  
  const collection = collections.find(c => c.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center text-photosphere-600">Loading collection...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center text-red-600">Error loading collection: {error}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center text-photosphere-600">Collection not found</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Back button */}
          <Link 
            to="/collections" 
            className="inline-flex items-center text-photosphere-600 hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Collections
          </Link>

          {/* Collection header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-serif text-photosphere-800 mb-4">
              {collection.title}
            </h1>
            <p className="text-photosphere-600 max-w-2xl mx-auto mb-4">
              {collection.description}
            </p>
            <p className="text-photosphere-500 text-sm">
              {collection.photos.length} photos in this collection
            </p>
          </motion.div>

          {/* Photos grid */}
          {collection.photos.length > 0 ? (
            <PhotoGrid photos={collection.photos} />
          ) : (
            <div className="text-center text-photosphere-600">
              No photos in this collection yet.
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CollectionDetail;