import React, { memo, ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { SkeletonOptimized } from '@/components/ui/skeleton-optimized';
import { cn } from "@/lib/utils";

interface SectionOptimizedProps {
  children: ReactNode;
  id?: string;
  className?: string;
  loadingVariant?: 'hero' | 'card' | 'text';
  threshold?: number;
  rootMargin?: string;
  enableLazyLoad?: boolean;
}

const SectionOptimized = memo(({
  children,
  id,
  className,
  loadingVariant = 'card',
  threshold = 0.1,
  rootMargin = '100px',
  enableLazyLoad = true,
  ...props
}: SectionOptimizedProps & React.HTMLAttributes<HTMLElement>) => {
  const { isIntersecting, setElement } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  const shouldLoad = !enableLazyLoad || isIntersecting;

  return (
    <section
      id={id}
      ref={setElement}
      className={cn("contain-layout", className)}
      {...props}
    >
      {shouldLoad ? (
        children
      ) : (
        <div className="section-standard px-4 md:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto space-y-6">
            <SkeletonOptimized variant={loadingVariant} animate={true} />
            {loadingVariant === 'hero' && (
              <>
                <SkeletonOptimized variant="text" lines={3} animate={true} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <SkeletonOptimized variant="card" animate={true} />
                  <SkeletonOptimized variant="card" animate={true} />
                  <SkeletonOptimized variant="card" animate={true} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
});

SectionOptimized.displayName = 'SectionOptimized';

export { SectionOptimized };