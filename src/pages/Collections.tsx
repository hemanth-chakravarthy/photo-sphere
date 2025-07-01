
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { collections, photos } from "@/data/photos";
import CollectionCard from "@/components/CollectionCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Collections = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-serif text-photosphere-800 mb-4">
              Our Collections
            </h1>
            <p className="text-photosphere-600 max-w-2xl mx-auto">
              Explore our carefully curated photo collections, dynamically organized by category and style.
            </p>
          </motion.div>

          <Tabs defaultValue="grid" className="mb-8">
            <TabsList className="mx-auto">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-6">
                {collections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-6 bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={collection.coverImage}
                        alt={collection.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="text-xl font-serif text-photosphere-800 mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-photosphere-600 text-sm mb-4">
                        {collection.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-photosphere-500 text-sm">
                          {collection.photoIds.length} photos
                        </span>
                        <a
                          href={`/collections/${collection.id}`}
                          className="text-accent hover:underline text-sm font-medium"
                        >
                          View Collection →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Collections;
