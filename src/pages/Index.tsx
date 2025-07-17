
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedPhotos from "@/components/FeaturedPhotos";
import Collections from "@/components/Collections";
import Footer from "@/components/Footer";
import Scene3D from "@/components/3D/Scene3D";
import FloatingElements from "@/components/3D/FloatingElements";
import { photos } from "@/data/photos";

const Index = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle 3D Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <Scene3D className="h-full w-full" enableZoom={false} enablePan={false} autoRotate>
          <FloatingElements count={8} />
        </Scene3D>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <Hero 
          title="WAY TO EXPLORE!"
          subtitle="Our world is amazing"
          scrollToGallery={scrollToGallery}
        />
        
        <div ref={galleryRef}>
          <FeaturedPhotos photos={photos} />
        </div>
        
        <Collections />
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
