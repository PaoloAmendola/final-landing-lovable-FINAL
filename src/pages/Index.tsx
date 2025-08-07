import React, { memo, useEffect, lazy, Suspense, useState } from "react";
import Header from "@/components/landing/Header";
import Manifesto from "@/components/landing/Manifesto";
import ProductSection from "@/components/landing/ProductSection";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import ScrollIndicator from "@/components/landing/ScrollIndicator";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { A11yControls } from "@/components/ui/a11y-controls";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { EnhancedLoadingState } from "@/components/ui/enhanced-loading-state";

// Lazy load heavy components that are below-the-fold
const CompleteTechnologySection = lazy(() => import("@/components/landing/CompleteTechnologySection"));
const AmazonIngredientsSection = lazy(() => import("@/components/landing/AmazonIngredientsSection"));
const SynergyCallout = lazy(() => import("@/components/landing/SynergyCallout"));
const BemTechSection = lazy(() => import("@/components/landing/BemTechSection"));
const DistributorSection = lazy(() => import("@/components/landing/DistributorSection"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const PreFooter = lazy(() => import("@/components/landing/PreFooter"));

import { usePWA } from "@/hooks/use-pwa";
import { usePerformance } from "@/hooks/use-performance";
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization";
import { performanceMonitor } from '@/utils/performance-monitor';
import { useAccessibilityEnhancements, announceToScreenReader } from "@/components/ui/enhanced-accessibility";
import { SkipToContent } from "@/components/ui/skip-to-content";

import { preloadCriticalResources } from "@/utils/preloader";

const Index = memo(() => {
  const { isOffline } = usePWA();
  const { performanceScore, metrics } = usePerformance();

  // Initialize performance optimization
  const { preloadCriticalResources: preloadOptimized, startRenderTiming, endRenderTiming } = usePerformanceOptimization({
    enableImageOptimization: true,
    enableLazyLoading: true,
    performanceBudget: {
      maxImageSize: 500 * 1024,
      maxBundleSize: 2 * 1024 * 1024,
      maxRenderTime: 200
    }
  });


  // Enhanced accessibility
  const { reducedMotion } = useAccessibilityEnhancements({
    skipLinks: true,
    keyboardNavigation: true,
    screenReaderOptimizations: true,
    reducedMotion: true,
    focusManagement: true
  });

  // Initialize critical optimizations with enhanced performance tracking
  useEffect(() => {
    startRenderTiming();
    
    // Initialize critical optimizations
    Promise.all([
      preloadCriticalResources()
    ]).catch(() => {
      // Silently handle preload errors
    });
    
    // Start preloading critical resources
    preloadOptimized([
      '/assets/frasco-nivela-hero-optimized.webp',
      '/lovable-uploads/icone-bem-beauty.png'
    ]);
    
    // Complete optimization after initial render
    setTimeout(() => {
      endRenderTiming();
    }, 100);

    // Run accessibility audit only in development (removed for production)
  }, [startRenderTiming, endRenderTiming, preloadOptimized]);

  // Performance monitoring
  useEffect(() => {
    const performanceTimer = setTimeout(() => {
      const score = performanceMonitor.getPerformanceScore();
      console.log('🎯 Final Performance Score:', score);
      
      if (score < 70) {
        console.warn('⚠️ Performance optimization needed');
      } else if (score >= 90) {
        console.log('🎉 Excellent performance achieved!');
      }
    }, 5000);
    
    return () => {
      clearTimeout(performanceTimer);
    };
  }, []);


  return (
    <div className={`min-h-screen bg-background font-montserrat scroll-smooth text-optimized contain-layout ${reducedMotion ? 'reduce-motion' : ''}`}>
      {/* Enhanced Skip to main content for accessibility */}
      <SkipToContent targetId="main-content" />
      
      <ScrollIndicator />
      <main id="main-content" tabIndex={-1}>
        <EnhancedErrorBoundary>
          <Header id="inicio" />
          <Manifesto id="manifesto" />
          <ProductSection id="produto" />
          
          {/* Complete Technology Section with all 3 parts */}
          <Suspense fallback={<EnhancedLoadingState isLoading={true} variant="skeleton" size="lg"><div /></EnhancedLoadingState>}>
            <CompleteTechnologySection id="tecnologia" />
          </Suspense>
          
          <Suspense fallback={<EnhancedLoadingState isLoading={true} variant="shimmer" size="md"><div /></EnhancedLoadingState>}>
            <AmazonIngredientsSection id="ingredientes" />
          </Suspense>

          <Suspense fallback={<EnhancedLoadingState isLoading={true} variant="pulse" size="sm"><div /></EnhancedLoadingState>}>
            <SynergyCallout id="sinergia" />
          </Suspense>
          
          <Suspense fallback={<EnhancedLoadingState isLoading={true} variant="skeleton" size="lg"><div /></EnhancedLoadingState>}>
            <BemTechSection id="bemtech" />
          </Suspense>
          
          <Suspense fallback={<EnhancedLoadingState isLoading={true} variant="shimmer" size="md"><div /></EnhancedLoadingState>}>
            <DistributorSection id="distributor" />
          </Suspense>
          
          <Suspense fallback={<EnhancedLoadingState isLoading={true} variant="skeleton" size="md"><div /></EnhancedLoadingState>}>
            <FAQSection id="faq" />
          </Suspense>
          
          <Suspense fallback={<EnhancedLoadingState isLoading={true} variant="skeleton" size="md"><div /></EnhancedLoadingState>}>
            <PreFooter id="prefooter" />
          </Suspense>
          
          <Footer id="contato" />
        </EnhancedErrorBoundary>
      </main>
      <InstallPrompt />
      <A11yControls />
      

      {isOffline && (
        <div 
          className="fixed bottom-4 left-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50 text-center"
          role="alert"
          aria-live="polite"
        >
          Você está offline. Algumas funcionalidades podem não estar disponíveis.
        </div>
      )}
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
