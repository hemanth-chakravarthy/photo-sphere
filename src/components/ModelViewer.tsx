import React, { useState, useRef, useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'touch-action'?: string;
        'disable-zoom'?: boolean;
        loading?: 'auto' | 'lazy' | 'eager';
        'reveal'?: 'auto' | 'interaction' | 'manual';
        'environment-image'?: string;
        'skybox-image'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        'exposure'?: string;
      };
    }
  }
}

interface ModelViewerProps {
  src: string;
  alt?: string;
  className?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  loading?: 'auto' | 'lazy' | 'eager';
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  src,
  alt = "3D Model",
  className = "",
  autoRotate = true,
  cameraControls = true,
  loading = "lazy"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const modelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const modelElement = modelRef.current;
    if (!modelElement) return;

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    modelElement.addEventListener('load', handleLoad);
    modelElement.addEventListener('error', handleError);

    return () => {
      modelElement.removeEventListener('load', handleLoad);
      modelElement.removeEventListener('error', handleError);
    };
  }, [src]);

  return (
    <model-viewer
      ref={modelRef}
      src={src}
      alt={alt}
      auto-rotate={autoRotate}
      camera-controls={cameraControls}
      touch-action="pan-y"
      loading={loading}
      reveal="auto"
      shadow-intensity="1"
      shadow-softness="0.5"
      exposure="1"
      className={`w-full h-full ${className}`}
      style={{ backgroundColor: 'transparent' }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D model...</p>
          </div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Failed to load 3D model</p>
          </div>
        </div>
      )}
    </model-viewer>
  );
};

export default ModelViewer;