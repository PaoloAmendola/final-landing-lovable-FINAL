import React, { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { ParallaxContainer } from "@/components/ui/parallax-container";
import { LazyImage } from "@/components/ui/image-lazy";

interface ProductSectionProps {
  id?: string;
}

const ProductSection = memo(({ id }: ProductSectionProps) => {
  return (
    <section id={id} className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Centralizado */}
        <AnimatedSection animation="fade" delay={0.2}>
          <div className="text-center space-refined-base mb-10 md:mb-12">
            <div className="space-refined-sm">
              <h2 className="heading-2 text-white mx-auto">
                Conheça <span className="font-playfair italic">NIVELA</span><sup className="text-lg">®</sup>
              </h2>
              <div className="h-0.5 bg-gradient-accent mx-auto w-16"></div>
            </div>
            <p className="body-lg text-muted-foreground mx-auto">
              NIVELA® é um retexturizador hidro nutritivo de alta performance, uma nova geração de escova progressiva sem formol, desenvolvida exclusivamente para profissionais.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Product Image */}
          <ParallaxContainer speed="slow" className="relative flex items-center justify-center order-1 lg:order-1">
            <AnimatedSection animation="slide-right" delay={0.4}>
              <div className="relative group">
                <LazyImage 
                  src="https://xnexfhgtqlryfkyuvihq.supabase.co/storage/v1/object/public/imagens//frasco-nivela-destaque.webp" 
                  alt="NIVELA® Retexturizador Hidro Nutritivo 1kg - Produto em destaque com textura gel inovadora"
                  className="w-full max-w-sm md:max-w-md lg:max-w-lg object-contain drop-shadow-2xl group-hover:scale-105 transition-elegant duration-500"
                  width={600}
                  height={600}
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                  priority={true}
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
            <StaggerContainer className="space-refined-base" staggerDelay={0.15}>
              <Card className="bg-card/50 backdrop-blur-sm border-accent/30 hover:border-accent/60 micro-scale group">
                <CardContent className="padding-refined-md space-refined-sm">
                  <h3 className="heading-4 text-primary">
                    Tecnologia Avançada
                  </h3>
                  <p className="body-base text-muted-foreground">
                    ASTRO QUAT V3® alinha, trata e sela a fibra em nano-escala, fios lisos e movimento natural em um único passo.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-accent/30 hover:border-accent/60 micro-scale group">
                <CardContent className="padding-refined-md space-refined-sm">
                  <h3 className="heading-4 text-primary">
                    Segurança na aplicação
                  </h3>
                  <p className="body-base text-muted-foreground">
                    Fórmula 100% livre de formol, sem fumaça ou ardência. Aplicação confortável para o profissional e cliente.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-accent/30 hover:border-accent/60 micro-scale group">
                <CardContent className="padding-refined-md space-refined-sm">
                  <h3 className="heading-4 text-primary">
                    Economia e Rendimento
                  </h3>
                  <p className="body-base text-muted-foreground">
                    Textura em gel inteligente rende até 30% mais aplicações e facilita o deslizamento da escova, aumentando a lucratividade do salão.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-accent/30 hover:border-accent/60 micro-scale group">
                <CardContent className="padding-refined-md space-refined-sm">
                  <h3 className="heading-4 text-primary">
                    Compatibilidade Universal
                  </h3>
                  <p className="body-base text-muted-foreground">
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