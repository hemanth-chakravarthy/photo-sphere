import { useState, useEffect } from "react";
import { Menu, Search, X, Shield, Instagram, Twitter, Facebook, Globe, Mail, Linkedin, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import SearchModal from "@/components/SearchModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { getSetting } = useSiteSettings();
  const { toast } = useToast();

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

  const renderSocialIcon = (url: string | null, icon: React.ReactNode, label: string, isEmail: boolean = false) => {
    if (isEmail) {
      return (
        <Dialog open={isMailModalOpen} onOpenChange={setIsMailModalOpen}>
          <DialogTrigger asChild>
            <button
              className="text-photosphere-800 hover:text-accent hover:scale-110 transition-all duration-200"
              aria-label={label}
            >
              {icon}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  readOnly
                  value={url || "No email set"}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => {
                    if (url) {
                      navigator.clipboard.writeText(url);
                      toast({
                        title: "Copied!",
                        description: "Email copied to clipboard",
                      });
                    }
                  }}
                  disabled={!url}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => {
                  if (url) {
                    navigator.clipboard.writeText(url);
                    toast({
                      title: "Copied!",
                      description: "Email copied to clipboard",
                    });
                  }
                }}
                disabled={!url}
                className="w-full"
              >
                Copy Email
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    const href = url && url.trim() !== '' ? url : "#";
    
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-photosphere-800 hover:text-accent hover:scale-110 transition-all duration-200"
        aria-label={label}
      >
        {icon}
      </a>
    );
  };

  const renderMobileSocialLink = (url: string | null, icon: React.ReactNode, label: string, isEmail: boolean = false) => {
    if (isEmail) {
      return (
        <button
          onClick={() => setIsMailModalOpen(true)}
          className="text-photosphere-800 hover:text-accent text-2xl font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
          aria-label={label}
        >
          {icon}
          {label}
        </button>
      );
    }

    const href = url && url.trim() !== '' ? url : "#";
    
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-photosphere-800 hover:text-accent text-2xl font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
        onClick={() => setIsOpen(false)}
        aria-label={label}
      >
        {icon}
        {label}
      </a>
    );
  };

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

            <div className="flex items-center space-x-3">
              {renderSocialIcon(getSetting('contact_email'), <Mail size={20} />, 'Email', true)}
              {renderSocialIcon(getSetting('instagram_url'), <Instagram size={20} />, 'Instagram')}
              {renderSocialIcon(getSetting('twitter_url'), <Twitter size={20} />, 'Twitter')}
              {renderSocialIcon(getSetting('linkedin_url'), <Linkedin size={20} />, 'LinkedIn')}
              {renderSocialIcon(getSetting('facebook_url'), <Facebook size={20} />, 'Facebook')}
              {renderSocialIcon(getSetting('website_url'), <Globe size={20} />, 'Website')}
              
              <button
                className="text-photosphere-800 hover:text-accent hover:scale-110 transition-all duration-200"
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
            
            {/* Social Media Links */}
            {renderMobileSocialLink(getSetting('contact_email'), <Mail size={24} />, 'Email', true)}
            {renderMobileSocialLink(getSetting('instagram_url'), <Instagram size={24} />, 'Instagram')}
            {renderMobileSocialLink(getSetting('twitter_url'), <Twitter size={24} />, 'Twitter')}
            {renderMobileSocialLink(getSetting('linkedin_url'), <Linkedin size={24} />, 'LinkedIn')}
            {renderMobileSocialLink(getSetting('facebook_url'), <Facebook size={24} />, 'Facebook')}
            {renderMobileSocialLink(getSetting('website_url'), <Globe size={24} />, 'Website')}
          </nav>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;