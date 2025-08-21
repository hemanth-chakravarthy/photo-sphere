
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Heart, Globe, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { getSetting, loading } = useSiteSettings();

  const renderSocialLink = (url: string | null, icon: React.ReactNode, label: string, isEmail: boolean = false) => {
    if (!url || url.trim() === '') return null;
    
    const href = isEmail ? `mailto:${url}` : url;
    
    return (
      <a 
        href={href}
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noopener noreferrer"}
        className="text-photosphere-200 hover:text-white transition-colors"
        title={label}
      >
        {icon}
      </a>
    );
  };
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
              {loading ? (
                <div className="flex space-x-4">
                  <div className="w-5 h-5 bg-photosphere-700 animate-pulse rounded"></div>
                  <div className="w-5 h-5 bg-photosphere-700 animate-pulse rounded"></div>
                  <div className="w-5 h-5 bg-photosphere-700 animate-pulse rounded"></div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {renderSocialLink(
                    getSetting('contact_email'), 
                    <Mail size={20} />, 
                    'Email',
                    true
                  )}
                  {renderSocialLink(
                    getSetting('instagram_url'), 
                    <Instagram size={20} />, 
                    'Instagram'
                  )}
                  {renderSocialLink(
                    getSetting('twitter_url'), 
                    <Twitter size={20} />, 
                    'Twitter'
                  )}
                  {renderSocialLink(
                    getSetting('facebook_url'), 
                    <Facebook size={20} />, 
                    'Facebook'
                  )}
                  {renderSocialLink(
                    getSetting('website_url'), 
                    <Globe size={20} />, 
                    'Website'
                  )}
                </div>
              )}
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
