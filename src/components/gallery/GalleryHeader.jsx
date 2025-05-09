
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminActions from "./AdminActions";

const GalleryHeader = ({ 
  isAuthenticated, 
  onShowLoginDialog, 
  onLogout, 
  onFileUpload 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16 text-center"
    >
      <h1 className="text-3xl md:text-5xl font-serif text-photosphere-800 mb-4">
        Photo Gallery
      </h1>
      <p className="text-photosphere-600 max-w-2xl mx-auto text-lg mb-8">
        Explore the world through my lens. A collection of moments captured from around the globe.
      </p>
      
      {isAuthenticated ? (
        <AdminActions 
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          onFileUpload={onFileUpload}
        />
      ) : (
        <Button 
          variant="outline"
          className="gap-2"
          size="lg"
          onClick={onShowLoginDialog}
        >
          <Lock size={20} />
          Admin Login
        </Button>
      )}
    </motion.div>
  );
};

export default GalleryHeader;
