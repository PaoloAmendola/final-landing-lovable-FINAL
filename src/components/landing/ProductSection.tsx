import React, { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { ParallaxContainer } from "@/components/ui/parallax-container";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductSectionProps {
  id?: string;
}

const ProductSection = memo(({ id }: ProductSectionProps) => {
  return (
    <section id={id} className="section-standard px-4 md:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Centralizado */}
        <AnimatedSection animation="fade" delay={0.2}>
          <div className="text-center space-y-4 lg:space-y-6 mb-12 md:mb-16 lg:mb-20">
            <div className="space-y-3 lg:space-y-4">
              <h2 className="titulo-h2 text-white">
                Conheça <span className="font-montserrat italic">NIVELA</span><sup className="text-lg md:text-xl lg:text-2xl">®</sup>
              </h2>
              <div className="h-0.5 lg:h-1 bg-gradient-accent mx-auto w-16 lg:w-24"></div>
            </div>
            <p className="subtitulo-premium max-w-3xl lg:max-w-4xl mx-auto">
              NIVELA® é um retexturizador hidro nutritivo de alta performance, uma nova geração de escova progressiva sem formol, desenvolvida exclusivamente para profissionais.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 section-spacing items-center">
          {/* Product Image */}
          <ParallaxContainer speed="slow" className="relative flex items-center justify-center order-1 lg:order-1">
            <AnimatedSection animation="slide-right" delay={0.4}>
              <div className="relative group">
                <OptimizedImage 
                  src="https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens//frasco-nivela-destaque.webp" 
                  alt="NIVELA® Retexturizador Hidro Nutritivo 1kg - Produto em destaque com textura gel inovadora"
                  className="w-full max-w-sm md:max-w-md lg:max-w-lg drop-shadow-2xl group-hover:scale-105 transition-elegant duration-500"
                  width={600}
                  height={600}
                  priority={true}
                  objectFit="contain"
                  fallback="/placeholder.svg"
                />
                {/* Enhanced product glow effect */}
                <div className="absolute inset-0 bg-gradient-accent/20 rounded-full blur-3xl -z-10 scale-75 group-hover:scale-90 transition-elegant duration-500"></div>
              </div>
            </AnimatedSection>
          </ParallaxContainer>

          {/* Content */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-2">
            {/* Feature Cards */}
            <StaggerContainer className="space-y-4 lg:space-y-5" staggerDelay={0.15}>
              <Card className="card-interactive group">
                <CardContent className="space-y-3">
                  <h3 className="titulo-h3">
                    Tecnologia Avançada
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    ASTRO QUAT V3® alinha, trata e sela a fibra em nano-escala, fios lisos e movimento natural em um único passo.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-interactive group">
                <CardContent className="space-y-3">
                  <h3 className="titulo-h3">
                    Segurança na aplicação
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Fórmula 100% livre de formol, sem fumaça ou ardência. Aplicação confortável para o profissional e cliente.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-interactive group">
                <CardContent className="space-y-3">
                  <h3 className="titulo-h3">
                    Economia e Rendimento
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Textura em gel inteligente rende até 30% mais aplicações e facilita o deslizamento da escova, aumentando a lucratividade do salão.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-interactive group">
                <CardContent className="space-y-3">
                  <h3 className="titulo-h3">
                    Compatibilidade Universal
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Resultados consistentes em todos os tipos de cabelo, do 1A ao 4C, inclusive loiros e quimicamente tratados.
                  </p>
                </CardContent>
              </Card>
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
});

ProductSection.displayName = 'ProductSection';

export default ProductSection;