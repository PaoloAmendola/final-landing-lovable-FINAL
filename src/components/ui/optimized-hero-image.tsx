import React from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import heroImageOptimized from '@/assets/frasco-nivela-hero-optimized.webp';

interface OptimizedHeroImageProps {
  className?: string;
  alt?: string;
  priority?: boolean;
}

export const OptimizedHeroImage = ({ 
  className = "", 
  alt = "NIVELA - Sistema de retexturização capilar profissional",
  priority = true 
}: OptimizedHeroImageProps) => {
  return (
    <OptimizedImage
      src={heroImageOptimized}
      alt={alt}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
};