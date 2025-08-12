
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

const About = () => {

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-serif text-photosphere-800 mb-4">
                About Us
              </h1>
              <p className="text-photosphere-600">
                Capturing moments, creating memories, and sharing stories through the lens.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-serif text-photosphere-800 mb-4">Our Story</h2>
                <p className="text-photosphere-600 mb-4">
                  We are passionate photographers dedicated to capturing life's most precious moments. 
                  Our journey began with a simple love for photography and has evolved into a 
                  mission to share beautiful imagery with the world.
                </p>
                <p className="text-photosphere-600">
                  Every photo tells a story, and we're here to help tell yours through our lens.
                </p>
              </motion.div>
              
              <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative rounded-lg overflow-hidden aspect-[4/3] w-full"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80"
                    alt="Nature photography"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gray-50 rounded-lg p-8"
            >
              <h2 className="text-2xl font-serif text-photosphere-800 mb-6 text-center">
                Contact Us
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-photosphere-600">
                      <Mail className="w-5 h-5 mr-2" />
                      <span>hello@photosphere.com</span>
                    </div>
                    <div className="flex items-center text-photosphere-600">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center text-photosphere-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <a href="#" className="text-photosphere-600 hover:text-accent">
                      <Github className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-photosphere-600 hover:text-accent">
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </div>
                </div>

                <ContactForm />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
