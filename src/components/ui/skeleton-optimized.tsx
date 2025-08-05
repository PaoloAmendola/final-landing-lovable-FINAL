import React, { memo } from 'react';
import { cn } from "@/lib/utils";

interface SkeletonOptimizedProps {
  className?: string;
  variant?: 'text' | 'card' | 'hero' | 'button' | 'avatar' | 'image';
  lines?: number;
  animate?: boolean;
  width?: string;
  height?: string;
}

const SkeletonOptimized = memo(({ 
  className,
  variant = 'text',
  lines = 1,
  animate = true,
  width,
  height,
  ...props
}: SkeletonOptimizedProps & React.HTMLAttributes<HTMLDivElement>) => {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'hero':
        return 'w-full h-96 md:h-[500px] lg:h-[600px] rounded-3xl';
      case 'card':
        return 'w-full h-48 rounded-2xl';
      case 'button':
        return 'w-32 h-12 rounded-xl';
      case 'avatar':
        return 'w-12 h-12 rounded-full';
      case 'image':
        return 'w-full h-64 rounded-xl';
      case 'text':
      default:
        return `w-full h-4 rounded-lg`;
    }
  };

  const baseClasses = cn(
    "bg-muted contain-paint",
    animate && "loading-shimmer",
    getVariantClasses(),
    className
  );

  // Para texto com múltiplas linhas
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              index === lines - 1 && "w-3/4" // Última linha menor
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={baseClasses}
      style={{ width, height }}
      {...props} 
    />
  );
});

SkeletonOptimized.displayName = 'SkeletonOptimized';

export { SkeletonOptimized };