import React, { memo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ParallaxContainer } from "@/components/ui/parallax-container";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { CTAButton, CTAStrategies } from "@/components/ui/cta-button";
import AccessFormModal from "@/components/landing/AccessFormModal";
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization";

import { ChevronDown } from "lucide-react";

interface HeaderProps {
  id?: string;
}

const Header = memo(({ id }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { startRenderTiming, endRenderTiming, getOptimizedImageSrc } = usePerformanceOptimization({
    enableImageOptimization: true,
    performanceBudget: {
      maxImageSize: 500 * 1024, // 500KB
      maxBundleSize: 1024 * 1024, // 1MB
      maxRenderTime: 100 // 100ms
    }
  });

  useEffect(() => {
    startRenderTiming();
    
    // Cleanup on unmount only
    return () => {
      endRenderTiming();
    };
  }, []); // Empty dependency array to run only once

  return (
    <header id={id} className="hero-section relative overflow-hidden">
      {/* Spotlight Effect Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial opacity-80"></div>
        {/* Additional focused light spot - Optimized */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-brand-latte/8 rounded-full blur-lg"></div>
      </div>
      
      {/* Navigation */}
      <nav className="w-full px-4 md:px-8 lg:px-12 py-8 flex justify-center items-center relative z-10">
        <OptimizedImage 
          src={getOptimizedImageSrc("/lovable-uploads/f576ae9a-1852-4645-bbb2-d9b8594bef91.png", 160)}
          alt="Bem Beauty Professional - Logo da marca"
          className="h-8 md:h-10 w-auto"
          width={160}
          height={40}
          priority={true}
          objectFit="contain"
          loading="eager"
        />
      </nav>

      {/* Main Content Grid */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 pb-12 lg:pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 section-spacing items-center justify-center min-h-screen py-4 lg:py-8">
            
            {/* Content Section - Balanced layout */}
            <div className="order-2 lg:order-1 w-full flex justify-center">
              <div className="hero-content flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 lg:space-y-6 w-full max-w-full lg:max-w-4xl px-2 sm:px-4 lg:px-0">
                
                {/* Unified Brand + Title Block */}
                <div className="space-y-3 lg:space-y-4">
                <h1 className="titulo-h1 text-brand-light">
                    <span className="block text-brand-latte font-medium">NIVELA®</span>
                    <span className="block">A evolução da</span>
                    <span className="block">escova progressiva</span>
                  </h1>
                </div>
                
                {/* Subtitle Description */}
                <p className="subtitulo-premium mt-4 lg:mt-8 px-2 sm:px-0">
                  <span className="block sm:inline">Desenvolvido com tecnologia patenteada,</span>
                  <span className="block sm:inline"> sem formol, com ativos da Amazônia</span>
                  <span className="block sm:inline"> e rendimento 30% superior.</span>
                </p>

                {/* Badges - Hierarchical design */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 w-full max-w-full lg:max-w-3xl mt-6 lg:mt-12 mb-8 lg:mb-14 px-4 sm:px-0">
                   <div className="bg-brand-deep/50 border border-brand-deep hover:bg-brand-deep/70 focus-visible:bg-brand-deep/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-latte/50 hover:scale-[1.01] focus-visible:scale-[1.01] transition-elegant px-4 py-3 lg:px-5 lg:py-4 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm shadow-lg hover:shadow-xl min-h-[72px] touch-manipulation" tabIndex={0} role="button" aria-label="Produto livre de formol">
                     <span className="text-sm md:text-base lg:text-lg font-bold text-brand-latte">LIVRE</span>
                     <span className="text-xs md:text-sm font-normal text-brand-cloud/90">de formol</span>
                   </div>
                   <div className="border border-brand-latte hover:bg-brand-latte/10 focus-visible:bg-brand-latte/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-latte/50 hover:scale-[1.01] focus-visible:scale-[1.01] transition-elegant px-4 py-3 lg:px-5 lg:py-4 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm shadow-lg hover:shadow-xl min-h-[72px] touch-manipulation" tabIndex={0} role="button" aria-label="Textura em gel">
                     <span className="text-sm md:text-base lg:text-lg font-bold text-brand-latte">TEXTURA</span>
                     <span className="text-xs md:text-sm font-normal text-brand-latte/90">em gel</span>
                   </div>
                   <div className="sm:col-span-2 lg:col-span-1 bg-brand-caramel/20 border border-brand-caramel hover:bg-brand-caramel/30 focus-visible:bg-brand-caramel/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-latte/50 hover:scale-[1.01] focus-visible:scale-[1.01] transition-elegant px-4 py-3 lg:px-5 lg:py-4 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm shadow-lg hover:shadow-xl min-h-[72px] touch-manipulation" tabIndex={0} role="button" aria-label="Tecnologia ASTRO QUAT V3">
                     <span className="text-sm md:text-base lg:text-lg font-bold text-brand-latte">TECNOLOGIA</span>
                     <span className="text-xs md:text-sm font-normal text-brand-latte/90">ASTRO QUAT V3®</span>
                   </div>
                 </div>

                 {/* Primary CTA Button - Captura de Lead Premium */}
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary w-full sm:w-auto max-w-sm"
                    aria-label="Solicitar acesso exclusivo ao NIVELA - Formulário de cadastro profissional"
                    tabIndex={0}
                  >
                    SOLICITAR ACESSO EXCLUSIVO
                  </button>
                
              </div>
            </div>

            {/* Product Image Section - Balanced layout */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2 w-full px-4 sm:px-6 lg:px-0">
              <div className="relative w-full flex justify-center lg:justify-end max-w-lg lg:max-w-none">
                {/* Product Image */}
                <OptimizedImage 
                  src={getOptimizedImageSrc("https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/frasco-nivela-hero%20(1).webp", 480)}
                  alt="NIVELA® - Retexturizador hidro nutritivo de 1kg sendo apresentado por mãos profissionais"
                  className="w-80 sm:w-96 md:w-[26rem] lg:w-[30rem] xl:w-[36rem] 2xl:w-[40rem] h-auto drop-shadow-2xl"
                  width={480}
                  height={480}
                  priority={true}
                  objectFit="contain"
                  loading="eager"
                />
                
                {/* Optimized spotlight glow effect */}
                <div className="absolute inset-0 bg-white/8 rounded-full blur-lg -z-10 scale-110"></div>
                <div className="absolute inset-0 bg-brand-latte/15 rounded-full blur-xl -z-10 scale-125"></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Background decorative elements - Optimized */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-accent/3 rounded-full blur-lg"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-deep/6 rounded-full blur-lg"></div>

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