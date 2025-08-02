import React from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface WatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any;
}

export const WatermarkedImage: React.FC<WatermarkedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  ...props 
}) => {
  const { settings } = useSiteSettings();

  const getWatermarkStyle = () => {
    if (!settings.watermark_enabled || !settings.watermark_image) {
      return {};
    }

    const position = settings.watermark_position || 'bottom-right';
    const opacity = (settings.watermark_opacity || 50) / 100;

    let positionStyles = {};
    switch (position) {
      case 'top-left':
        positionStyles = { top: '10px', left: '10px' };
        break;
      case 'top-right':
        positionStyles = { top: '10px', right: '10px' };
        break;
      case 'bottom-left':
        positionStyles = { bottom: '10px', left: '10px' };
        break;
      case 'bottom-right':
        positionStyles = { bottom: '10px', right: '10px' };
        break;
      case 'center':
        positionStyles = { 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)' 
        };
        break;
      default:
        positionStyles = { bottom: '10px', right: '10px' };
    }

    return {
      position: 'absolute' as const,
      opacity,
      maxWidth: '100px',
      maxHeight: '100px',
      pointerEvents: 'none' as const,
      zIndex: 10,
      ...positionStyles,
    };
  };

  return (
    <div className={`relative ${className}`} {...props}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      {settings.watermark_enabled && settings.watermark_image && (
        <img
          src={settings.watermark_image}
          alt="Watermark"
          style={getWatermarkStyle()}
          className="select-none"
        />
      )}
    </div>
  );
};