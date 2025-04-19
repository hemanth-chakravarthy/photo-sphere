
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { collections } from "@/data/photos";
import CollectionCard from "@/components/CollectionCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Collections = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
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
              Explore our carefully curated photo collections, each telling its own unique story.
            </p>
          </motion.div>

          <Tabs defaultValue="grid" className="mb-8 w-full">
            <TabsList className="mx-auto">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {collections.map((collection, index) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <div className="space-y-4 md:space-y-6">
                {collections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-4 md:gap-6 bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="w-full md:w-48 h-48 md:h-32 flex-shrink-0">
                      <img
                        src={collection.coverImage}
                        alt={collection.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 md:p-5">
                      <h3 className="text-xl font-serif text-photosphere-800 mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-photosphere-600 text-sm mb-4">
                        {collection.description}
                      </p>
                      <a
                        href={`/collections/${collection.id}`}
                        className="text-accent hover:underline text-sm font-medium flex items-center"
                      >
                        View Collection
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </a>
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
