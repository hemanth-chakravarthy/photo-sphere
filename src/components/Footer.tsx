
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-photosphere-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="font-serif text-2xl font-medium">
              PhotoSphere
            </Link>
            <p className="text-photosphere-200 mt-2 text-sm">
              Capturing moments, preserving memories
            </p>
          </div>
          
          <div className="flex space-x-8">
            <div>
              <h4 className="font-medium mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-photosphere-200 hover:text-white transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-photosphere-200 hover:text-white transition-colors text-sm">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/collections" className="text-photosphere-200 hover:text-white transition-colors text-sm">
                    Collections
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-photosphere-200 hover:text-white transition-colors text-sm">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-photosphere-200 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-photosphere-200 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-photosphere-200 hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-photosphere-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-photosphere-300">
          <p>© {new Date().getFullYear()} PhotoSphere. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Made with <Heart size={14} className="mx-1 text-red-500" /> for your memories
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
