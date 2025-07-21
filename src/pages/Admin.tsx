
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Upload, Settings, Images } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/AdminLogin";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoManager from "@/components/PhotoManager";
import { usePhotos } from "@/hooks/usePhotos";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Admin = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const { refetch } = usePhotos();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      setShowLogin(true);
    } else if (isAdmin) {
      setShowLogin(false);
    }
  }, [isAdmin, loading]);

  const handleLogout = async () => {
    await signOut();
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-photosphere-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {showLogin ? (
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-serif text-photosphere-800 mb-4">
                  Admin Access
                </h1>
                <p className="text-photosphere-600">
                  Sign in to manage your photo gallery
                </p>
              </motion.div>
              
              <AdminLogin onSuccess={() => setShowLogin(false)} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-photosphere-800">
                  Admin Dashboard
                </h1>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>

              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload size={16} />
                    Upload Photos
                  </TabsTrigger>
                  <TabsTrigger value="manage" className="flex items-center gap-2">
                    <Images size={16} />
                    Manage Photos
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings size={16} />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-8">
                  <PhotoUpload onUploadSuccess={refetch} />
                </TabsContent>

                <TabsContent value="manage" className="mt-8">
                  <PhotoManager />
                </TabsContent>

                <TabsContent value="settings" className="mt-8">
                  <div className="text-center text-photosphere-600">
                    Settings panel coming soon...
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
