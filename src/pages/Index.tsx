import React, { memo, lazy, Suspense } from "react";
import Header from "@/components/landing/Header";
import Manifesto from "@/components/landing/Manifesto";
import ProductSection from "@/components/landing/ProductSection";
import Footer from "@/components/landing/Footer";

// Lazy load heavy components that are below-the-fold
const CompleteTechnologySection = lazy(() => import("@/components/landing/CompleteTechnologySection"));
const AmazonIngredientsSection = lazy(() => import("@/components/landing/AmazonIngredientsSection"));
const SynergyCallout = lazy(() => import("@/components/landing/SynergyCallout"));
const BemTechSection = lazy(() => import("@/components/landing/BemTechSection"));
const DistributorSection = lazy(() => import("@/components/landing/DistributorSection"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const PreFooter = lazy(() => import("@/components/landing/PreFooter"));

import { useCriticalImages } from "@/hooks/use-critical-images";

const Index = memo(() => {
  // Simplified initialization - only critical images preload
  useCriticalImages();


  return (
    <div className="min-h-screen bg-background font-montserrat scroll-smooth">
      <main id="main-content">
          <Header id="inicio" />
          <Manifesto id="manifesto" />
          <ProductSection id="produto" />
          
          {/* Complete Technology Section with all 3 parts */}
          <Suspense fallback={
            <div className="section-standard px-4 md:px-6 lg:px-12">
              <div className="max-w-6xl mx-auto">
                <div className="w-full h-96 bg-muted rounded-3xl loading-shimmer mb-8"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded-lg loading-shimmer w-3/4"></div>
                  <div className="h-4 bg-muted rounded-lg loading-shimmer w-full"></div>
                  <div className="h-4 bg-muted rounded-lg loading-shimmer w-2/3"></div>
                </div>
              </div>
            </div>
          }>
            <CompleteTechnologySection id="tecnologia" />
          </Suspense>
          
          <Suspense fallback={
            <div className="section-standard px-4 md:px-6 lg:px-12">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="w-full h-80 bg-muted rounded-2xl loading-shimmer"></div>
                  <div className="space-y-6">
                    <div className="h-8 bg-muted rounded-lg loading-shimmer w-3/4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded-lg loading-shimmer"></div>
                      <div className="h-4 bg-muted rounded-lg loading-shimmer w-5/6"></div>
                      <div className="h-4 bg-muted rounded-lg loading-shimmer w-4/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }>
            <AmazonIngredientsSection id="ingredientes" />
          </Suspense>

          <Suspense fallback={
            <div className="section-standard px-4 md:px-6 lg:px-12">
              <div className="max-w-4xl mx-auto text-center">
                <div className="h-12 bg-muted rounded-lg loading-shimmer w-2/3 mx-auto mb-6"></div>
                <div className="h-6 bg-muted rounded-lg loading-shimmer w-full"></div>
              </div>
            </div>
          }>
            <SynergyCallout id="sinergia" />
          </Suspense>
          
          <Suspense fallback={
            <div className="section-standard px-4 md:px-6 lg:px-12">
              <div className="max-w-6xl mx-auto">
                <div className="h-10 bg-muted rounded-lg loading-shimmer w-1/2 mx-auto mb-12"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-48 bg-muted rounded-2xl loading-shimmer"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <BemTechSection id="bemtech" />
          </Suspense>
          
          <Suspense fallback={
            <div className="section-standard px-4 md:px-6 lg:px-12">
              <div className="max-w-4xl mx-auto text-center">
                <div className="h-8 bg-muted rounded-lg loading-shimmer w-2/3 mx-auto mb-8"></div>
                <div className="h-12 bg-muted rounded-xl loading-shimmer w-48 mx-auto"></div>
              </div>
            </div>
          }>
            <DistributorSection id="distributor" />
          </Suspense>
          
          <Suspense fallback={
            <div className="section-standard px-4 md:px-6 lg:px-12">
              <div className="max-w-4xl mx-auto">
                <div className="h-8 bg-muted rounded-lg loading-shimmer w-1/3 mx-auto mb-12"></div>
                <div className="space-y-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-16 bg-muted rounded-xl loading-shimmer"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <FAQSection id="faq" />
          </Suspense>
          
          <Suspense fallback={
            <div className="section-standard px-4 md:px-6 lg:px-12">
              <div className="max-w-6xl mx-auto text-center">
                <div className="h-10 bg-muted rounded-lg loading-shimmer w-1/2 mx-auto mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-64 bg-muted rounded-2xl loading-shimmer"></div>
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded-lg loading-shimmer"></div>
                    <div className="h-4 bg-muted rounded-lg loading-shimmer w-5/6"></div>
                    <div className="h-12 bg-muted rounded-xl loading-shimmer w-32"></div>
                  </div>
                </div>
              </div>
            </div>
          }>
            <PreFooter id="prefooter" />
          </Suspense>
          
          <Footer />
      </main>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
