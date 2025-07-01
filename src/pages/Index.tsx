
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import FeaturedPhotos from "@/components/FeaturedPhotos";
import Collections from "@/components/Collections";
import Footer from "@/components/Footer";
import { photos } from "@/data/photos";

const Index = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  
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
      
      <VideoSection />
      
      <div ref={galleryRef}>
        <FeaturedPhotos photos={photos} />
      </div>
      
      <Collections />
      
      <Footer />
    </div>
  );
};

export default Index;
