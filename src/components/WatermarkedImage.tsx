import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface WatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  [key: string]: any;
}

export const WatermarkedImage = ({ src, alt, className, priority = false, ...props }: WatermarkedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { getSetting } = useSiteSettings();
  
  const enableWatermark = getSetting('enable_watermark', false);
  const watermarkUrl = getSetting('watermark_url');
  const watermarkPosition = getSetting('watermark_position', 'bottom-right');
  const watermarkOpacity = getSetting('watermark_opacity', 50);

  const getWatermarkPosition = () => {
    switch (watermarkPosition) {
      case 'top-left':
        return 'top-2 left-2';
      case 'top-right':
        return 'top-2 right-2';
      case 'bottom-left':
        return 'bottom-2 left-2';
      case 'bottom-right':
        return 'bottom-2 right-2';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-2 right-2';
    }
  };

  return (
    <div className="relative overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setImageLoaded(true)}
        {...props}
      />
      
      {enableWatermark && watermarkUrl && imageLoaded && (
        <div 
          className={`absolute ${getWatermarkPosition()} z-10 pointer-events-none`}
          style={{ opacity: watermarkOpacity / 100 }}
        >
          <img
            src={watermarkUrl}
            alt="Watermark"
            className="max-w-16 max-h-16 object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default WatermarkedImage;