
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-16">
        <motion.div 
          className="text-center px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-serif text-photosphere-800 mb-4">404</h1>
          <p className="text-xl text-photosphere-600 mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/" className="px-6">
              Return to Home
            </Link>
          </Button>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
