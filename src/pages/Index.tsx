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
import { useAnalytics } from "@/hooks/use-analytics";
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization";
import { performanceMonitor } from '@/utils/performance-monitor';
import { useEnhancedSEO, generateProductSchema, generateOrganizationSchema } from "@/components/ui/enhanced-seo";
import { useAccessibilityEnhancements, announceToScreenReader } from "@/components/ui/enhanced-accessibility";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { preloadCriticalResources } from "@/utils/preloader";

const Index = memo(() => {
  const { isOffline } = usePWA();
  const { performanceScore, metrics } = usePerformance();
  const { trackPageView, trackPerformance, trackConversion } = useAnalytics();

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

  // Enhanced SEO - Completo e Otimizado
  useEnhancedSEO({
    title: 'NIVELA® - Revolução Beauty Tech | Escova Progressiva Sem Formol',
    description: 'NIVELA® - Escova progressiva revolucionária com tecnologia ASTRO QUAT V3®. Sem formol, com ativos da Amazônia e 30% mais rendimento. Transforme cabelos com tecnologia patenteada.',
    keywords: [
      'nivela', 'escova progressiva', 'sem formol', 'tecnologia capilar', 
      'astro quat v3', 'amazônia', 'bem beauty', 'progressive brush',
      'tratamento capilar', 'alisamento', 'hidratação', 'nutrição',
      'cabelo liso', 'salon professional', 'beauty tech', 'inovação',
      'retexturizador', 'hidro nutritivo', 'textura gel'
    ],
    canonical: window.location.href,
    ogImage: 'https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/frasco-nivela-hero.webp',
    ogType: 'product',
    locale: 'pt_BR',
    alternateLocales: ['en_US', 'es_ES'],
    structuredData: [
      generateProductSchema({
        name: 'NIVELA® - Retexturizador Hidro Nutritivo 1kg',
        description: 'Produto revolucionário com tecnologia ASTRO QUAT V3® e ingredientes da Amazônia. Escova progressiva sem formol com textura gel inovadora.',
        brand: 'Bem Beauty Professional',
        image: 'https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/frasco-nivela-hero.webp',
        url: window.location.href,
        availability: 'PreOrder'
      }),
      generateOrganizationSchema({
        name: 'Bem Beauty Professional',
        url: window.location.origin,
        logo: 'https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/logo-bembeauty-transparente.webp'
      })
    ]
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
      'https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/frasco-nivela-hero.webp',
      'https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/logo-bembeauty-transparente.webp'
    ]);
    
    // Complete optimization after initial render
    setTimeout(() => {
      endRenderTiming();
    }, 100);

    // Run accessibility audit only in development (removed for production)
  }, [startRenderTiming, endRenderTiming, preloadOptimized]);

  // Enhanced performance tracking with Web Vitals
  useEffect(() => {
    if (metrics) {
      const performanceData = {
        page_load_time: performance.now(),
        first_contentful_paint: metrics.fcp || 0,
        largest_contentful_paint: metrics.lcp || 0,
        cumulative_layout_shift: metrics.cls || 0,
        first_input_delay: metrics.fid || 0
      };
      
      trackPerformance(performanceData);
      
      // Track performance issues
      if (metrics.lcp && metrics.lcp > 2500) {
        trackConversion({
          type: 'error',
          section: 'lcp_warning',
          metadata: { lcp: metrics.lcp }
        });
      }
      
      if (metrics.cls && metrics.cls > 0.1) {
        trackConversion({
          type: 'error',
          section: 'cls_warning', 
          metadata: { cls: metrics.cls }
        });
      }
    }
    
    // Performance monitoring - single check after 5s
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
  }, [metrics, trackPerformance, trackConversion]);

  // Track section views with Intersection Observer - Optimized
  useEffect(() => {
    const observedSections = new Set();
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionId = entry.target.id;
          // Only track valid section IDs and avoid duplicates
          if (sectionId && sectionId !== 'main-content' && !observedSections.has(sectionId)) {
            observedSections.add(sectionId);
            trackConversion({
              type: 'section_view',
              section: sectionId,
              metadata: {
                visibility_ratio: entry.intersectionRatio,
                viewport_height: window.innerHeight
              }
            });
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: [0.5],
      rootMargin: '0px 0px -20% 0px'
    });

    // Observe only valid sections with IDs
    const validSections = document.querySelectorAll('section[id]:not([id="main-content"]), div[data-section]');
    validSections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      observedSections.clear();
    };
  }, [trackConversion]);

  return (
    <div className={`min-h-screen bg-background font-montserrat scroll-smooth text-optimized contain-layout ${reducedMotion ? 'reduce-motion' : ''}`}>
      {/* Enhanced Skip to main content for accessibility */}
      <SkipToContent targetId="main-content" />
      
      <ScrollIndicator />
      <main id="main-content" tabIndex={-1}>
        <EnhancedErrorBoundary 
          onError={(error, errorInfo) => {
            // Track error for analytics
            trackConversion({
              type: 'error',
              section: 'app_error',
              metadata: {
                error_message: error.message,
                component_stack: errorInfo.componentStack,
                url: window.location.href
              }
            });
          }}
        >
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
      <PerformanceMonitor reportingEnabled={!import.meta.env.DEV} />

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
