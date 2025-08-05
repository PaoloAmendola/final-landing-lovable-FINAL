import React, { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoLazy } from "@/components/ui/video-lazy";
import { logger } from "@/utils/logger";

interface TechnologySectionProps {
  id?: string;
}

const TechnologySection = memo(({ id }: TechnologySectionProps) => {
  const processSteps = [
    { 
      step: "01", 
      title: "Penetração", 
      description: "Penetra até o córtex para iniciar a transformação de dentro para fora.",
      badge: "Ação Profunda"
    },
    { 
      step: "02", 
      title: "Modificação", 
      description: "Modifica ligações secundárias, sem danificar estrutura proteica",
      badge: "Modificação Molecular"
    },
    { 
      step: "03", 
      title: "Reparação", 
      description: "Repara micro-danos com ativos nutritivos e lipídicos.",
      badge: "Nutrição Direcionada"
    },
    { 
      step: "04", 
      title: "Realinhamento", 
      description: "Realinha a estrutura da queratina, reduzindo frizz e volume",
      badge: "Alinhamento Preciso"
    },
  ];

  const handleVideoError = () => {
    logger.warn('Erro ao carregar vídeo da tecnologia', { section: 'TechnologySection' });
  };

  return (
    <section id={id} className="section-standard px-4 md:px-6 lg:px-12 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20 space-y-6 lg:space-y-8">
          <div className="space-y-4">
            <h2 className="titulo-h2 px-4 sm:px-0">
              Tecnologia ASTRO QUAT V3<sup className="text-lg md:text-xl lg:text-2xl">®</sup>
            </h2>
            <div className="h-1 bg-gradient-accent mx-auto w-24"></div>
          </div>
          
          {/* Descriptive Paragraph */}
          <div className="max-w-5xl mx-auto">
            <p className="subtitulo-premium">
              Desenvolvida por pesquisa molecular avançada, a tecnologia ASTRO QUAT V3® atua em escala nanométrica, reorganizando as ligações internas da fibra capilar com precisão e segurança, totalmente livre de formol.
            </p>
          </div>
        </div>

        {/* Video Player - Mobile Only (appears after header) */}
        <div className="block lg:hidden mb-12 flex justify-center">
          <div className="relative w-full max-w-lg">
            <VideoLazy
              src="https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/videos/tecnologia-oficial-compactado.mp4"
              className="w-full aspect-[4/3] object-cover rounded-lg"
              autoPlay={false}
              muted={true}
              loop={true}
              controls={true}
              title="Tecnologia ASTRO QUAT V3® - Demonstração Molecular"
              onError={handleVideoError}
            />
          </div>
        </div>

        {/* Side by Side Layout */}
        <div className="flex flex-col lg:flex-row section-spacing items-start">
          {/* Process Steps Grid - Left Side */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative min-h-[400px] lg:min-h-[480px]">
              {/* Flow indicators for desktop 2x2 grid */}
              <div className="hidden md:block absolute top-1/4 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-accent/60 to-accent/30 transform -translate-x-1/2 z-0"></div>
              <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-accent/60 to-accent/30 transform -translate-y-1/2 z-0"></div>
              
              {processSteps.map((process, index) => (
                <Card key={process.step} className="card-interactive group relative z-10 h-full">
                  <CardContent className="relative h-full flex flex-col justify-between p-6 lg:p-8">
                    {/* Number positioned half outside, half inside the card */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-accent rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xl z-20">
                      <span className="font-bold text-base lg:text-lg text-brand-black font-montserrat">
                        {process.step}
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-4 lg:space-y-6 pt-6">
                      <div className="space-y-3 lg:space-y-4">
                        <h3 className="titulo-h3 text-xl lg:text-2xl leading-tight">
                          {process.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-base lg:text-lg min-h-[3rem] lg:min-h-[4rem]">
                          {process.description}
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between mt-auto pt-4">
                        <Badge variant="secondary" className="text-xs lg:text-sm px-3 py-1">
                          {process.badge}
                        </Badge>
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-accent/20 flex items-center justify-center group-hover:bg-gradient-accent/30 transition-colors duration-200">
                          <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-gradient-accent"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Video Player - Desktop Only (right side) */}
          <div className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <VideoLazy
                src="https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/videos/tecnologia-oficial-compactado.mp4"
                className="w-full aspect-[4/3] object-cover rounded-lg"
                autoPlay={true}
                muted={true}
                loop={true}
                controls={false}
                title="Tecnologia ASTRO QUAT V3® - Demonstração Molecular"
                onError={handleVideoError}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

TechnologySection.displayName = 'TechnologySection';

export default TechnologySection;