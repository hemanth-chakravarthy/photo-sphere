
import { useState, useEffect } from "react";
import { Menu, Search, X, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import SearchModal from "@/components/SearchModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          isScrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-photosphere-800 hover:text-accent transition-colors"
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
              <Link to="/" className="ml-4 lg:ml-0">
                <div className="font-serif text-2xl font-medium text-photosphere-800">
                  PhotoSphere
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className="text-photosphere-800 hover:text-accent font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/gallery"
                className="text-photosphere-800 hover:text-accent font-medium transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/collections"
                className="text-photosphere-800 hover:text-accent font-medium transition-colors"
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="text-photosphere-800 hover:text-accent font-medium transition-colors"
              >
                About
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-photosphere-800 hover:text-accent font-medium transition-colors flex items-center gap-1"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center">
              <button
                className="text-photosphere-800 hover:text-accent transition-colors"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out transform lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex justify-end p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="text-photosphere-800"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-8 p-8 text-center">
            <Link
              to="/"
              className="text-photosphere-800 hover:text-accent text-2xl font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className="text-photosphere-800 hover:text-accent text-2xl font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/collections"
              className="text-photosphere-800 hover:text-accent text-2xl font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/about"
              className="text-photosphere-800 hover:text-accent text-2xl font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-photosphere-800 hover:text-accent text-2xl font-medium transition-colors flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Shield size={20} />
                Admin
              </Link>
            )}
          </nav>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
