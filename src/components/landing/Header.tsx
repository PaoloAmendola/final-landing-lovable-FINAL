import React, { memo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ParallaxContainer } from "@/components/ui/parallax-container";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { PerformanceAwareImage } from "@/components/ui/performance-aware-image";
import { CTAButton, CTAStrategies } from "@/components/ui/cta-button";
import AccessFormModal from "@/components/landing/AccessFormModal";
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization";

import { ChevronDown } from "lucide-react";

interface HeaderProps {
  id?: string;
}

const Header = memo(({ id }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { startRenderTiming, endRenderTiming, optimizeImage } = usePerformanceOptimization({
    enableImageOptimization: true,
    performanceBudget: {
      maxImageSize: 500 * 1024, // 500KB
      maxBundleSize: 1024 * 1024, // 1MB
      maxRenderTime: 100 // 100ms
    }
  });

  useEffect(() => {
    startRenderTiming();
    return () => endRenderTiming();
  }, [startRenderTiming, endRenderTiming]);

  return (
    <header id={id} className="hero-section relative overflow-hidden">
      {/* Spotlight Effect Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial opacity-80"></div>
        {/* Additional focused light spot */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-brand-latte/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Navigation */}
      <nav className="w-full px-4 md:px-8 lg:px-12 py-8 flex justify-center items-center relative z-10">
        <PerformanceAwareImage 
          src={optimizeImage("/lovable-uploads/f576ae9a-1852-4645-bbb2-d9b8594bef91.png", { 
            width: 200, 
            height: 50, 
            quality: 90,
            format: 'webp'
          })}
          alt="Bem Beauty Professional - Logo da marca"
          className="h-8 md:h-10 w-auto object-contain"
          width={160}
          height={40}
          sizes="(max-width: 768px) 160px, 200px"
          priority={true}
          loading="eager"
          placeholder="skeleton"
        />
      </nav>

      {/* Main Content Grid - Responsividade otimizada */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 pb-12 lg:pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-16 items-center justify-center min-h-screen py-8 lg:py-12">
            
            {/* Content Section - 60% width on desktop */}
            <div className="lg:col-span-3 order-2 lg:order-1 w-full flex justify-center">
              <div className="hero-content flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 w-full max-w-full lg:max-w-4xl px-2 sm:px-4 lg:px-0">
                
                {/* Unified Brand + Title Block - Mobile otimizado */}
                <div className="space-y-4 lg:space-y-6">
                  <h1 className="heading-1 text-brand-light mx-auto text-center lg:text-left">
                    <span className="block text-brand-latte font-playfair">NIVELA®</span>
                    <span className="block">A evolução da</span>
                    <span className="block">escova progressiva</span>
                  </h1>
                </div>
                
                {/* Subtitle Description - Mobile otimizado */}
                <p className="body-lg text-brand-cloud mx-auto text-center lg:text-left max-w-2xl px-2 sm:px-0">
                  <span className="block sm:inline">Desenvolvido com tecnologia patenteada,</span>
                  <span className="block sm:inline"> sem formol, com ativos da Amazônia</span>
                  <span className="block sm:inline"> e rendimento 30% superior.</span>
                </p>

                 {/* Badges - Responsividade e touch targets otimizados */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl mt-8 mb-8 px-2 sm:px-0">
                   <div className="bg-brand-deep/50 border border-brand-deep hover:bg-brand-deep/70 micro-hover focus-enhanced p-4 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm min-h-[64px] touch-target" tabIndex={0} role="button" aria-label="Produto livre de formol">
                     <span className="text-sm font-semibold text-brand-latte">LIVRE</span>
                     <span className="text-xs text-brand-cloud/90">de formol</span>
                   </div>
                   <div className="border border-brand-latte hover:bg-brand-latte/10 micro-hover focus-enhanced p-4 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm min-h-[64px] touch-target" tabIndex={0} role="button" aria-label="Textura em gel">
                     <span className="text-sm font-semibold text-brand-latte">TEXTURA</span>
                     <span className="text-xs text-brand-latte/90">em gel</span>
                   </div>
                   <div className="sm:col-span-2 lg:col-span-1 bg-brand-caramel/20 border border-brand-caramel hover:bg-brand-caramel/30 micro-hover focus-enhanced p-4 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm min-h-[64px] touch-target" tabIndex={0} role="button" aria-label="Tecnologia ASTRO QUAT V3">
                     <span className="text-sm font-semibold text-brand-latte">TECNOLOGIA</span>
                     <span className="text-xs text-brand-latte/90">ASTRO QUAT V3®</span>
                   </div>
                 </div>

                 {/* Primary CTA Button - Mobile otimizado */}
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="w-full sm:w-auto min-w-[280px] max-w-sm btn-primary text-center"
                   aria-label="Solicitar acesso exclusivo ao NIVELA - Formulário de cadastro profissional"
                 >
                   SOLICITAR ACESSO EXCLUSIVO
                 </button>
                
              </div>
            </div>

            {/* Product Image Section - 40% width on desktop */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end order-1 lg:order-2 w-full px-4 sm:px-6 lg:px-0">
              <div className="relative w-full flex justify-center lg:justify-end max-w-lg lg:max-w-none">
                {/* Product Image - Otimizada para performance */}
                <PerformanceAwareImage 
                  src={optimizeImage("https://xnexfhgtqlryfkyuvihq.supabase.co/storage/v1/object/public/imagens/frasco-nivela-hero.webp", {
                    width: 640,
                    height: 640,
                    quality: 90,
                    format: 'webp'
                  })}
                  alt="NIVELA® - Retexturizador hidro nutritivo de 1kg sendo apresentado por mãos profissionais"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain drop-shadow-2xl"
                  width={640}
                  height={640}
                  sizes="(max-width: 320px) 280px, (max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 416px, (max-width: 1280px) 480px, 576px"
                  priority={true}
                  loading="eager"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                
                {/* Enhanced spotlight glow effect */}
                <div className="absolute inset-0 bg-white/15 rounded-full blur-3xl -z-10 scale-110"></div>
                <div className="absolute inset-0 bg-brand-latte/25 rounded-full blur-2xl -z-10 scale-150"></div>
                <div className="absolute inset-0 bg-white/8 rounded-full blur-xl -z-10 scale-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-deep/10 rounded-full blur-3xl"></div>

      {/* Access Form Modal */}
      <AccessFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;