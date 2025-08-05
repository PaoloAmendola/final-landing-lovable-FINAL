import React, { useState, useRef, useEffect, memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallback?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  priority = false,
  fallback = "/placeholder.svg",
  objectFit = 'contain',
  className = "",
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority) return; // Não usar lazy loading para imagens críticas

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Calcular aspect ratio se width e height fornecidos
  const aspectRatio = width && height ? width / height : undefined;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder/Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full loading-shimmer" />
        </div>
      )}

      {/* Imagem principal */}
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? fallback : src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full transition-opacity duration-300 gpu-accelerated
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${objectFit === 'contain' ? 'object-contain' : 
              objectFit === 'cover' ? 'object-cover' : 
              objectFit === 'fill' ? 'object-fill' : 
              objectFit === 'none' ? 'object-none' : 'object-scale-down'}
          `}
          style={{
            willChange: isLoaded ? 'auto' : 'transform, opacity'
          }}
          {...props}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">Erro ao carregar imagem</span>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage };