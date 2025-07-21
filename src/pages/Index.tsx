
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedPhotos from "@/components/FeaturedPhotos";
import Collections from "@/components/Collections";
import Footer from "@/components/Footer";
import { useFeaturedPhotos } from "@/hooks/usePhotos";

const Index = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const { featuredPhotos, loading } = useFeaturedPhotos();
  
  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero 
        title="WAY TO EXPLORE!"
        subtitle="Our world is amazing"
        scrollToGallery={scrollToGallery}
      />
      
      <div ref={galleryRef}>
        {loading ? (
          <div className="py-12">
            <div className="container mx-auto px-6">
              <div className="text-center text-photosphere-600">Loading photos...</div>
            </div>
          </div>
        ) : (
          <FeaturedPhotos photos={featuredPhotos} />
        )}
      </div>
      
      <Collections />
      
      <Footer />
    </div>
  );
};

export default Index;
