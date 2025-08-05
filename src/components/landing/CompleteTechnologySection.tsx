import { memo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoLazy } from "@/components/ui/video-lazy";
import { cn } from "@/lib/utils";
import { logger } from "@/utils/logger";

interface CompleteTechnologySectionProps {
  id?: string;
}

const processSteps = [
  {
    number: "01",
    title: "Penetração",
    description: "Penetra até o córtex para iniciar a transformação de dentro para fora.",
    badge: "Ação Profunda",
    gradient: "from-blue-500/5 to-cyan-500/8"
  },
  {
    number: "02", 
    title: "Modificação",
    description: "Modifica ligações secundárias, sem danificar estrutura proteica",
    badge: "Modificação Molecular",
    gradient: "from-purple-500/5 to-violet-500/8"
  },
  {
    number: "03",
    title: "Reparação", 
    description: "Repara micro-danos com ativos nutritivos e lipídicos.",
    badge: "Nutrição Direcionada",
    gradient: "from-green-500/5 to-emerald-500/8"
  },
  {
    number: "04",
    title: "Realinhamento",
    description: "Realinha a estrutura da queratina, reduzindo frizz e volume",
    badge: "Alinhamento Preciso", 
    gradient: "from-amber-500/5 to-orange-500/8"
  }
];

const CompleteTechnologySection = memo(({ id }: CompleteTechnologySectionProps) => {
  const handleVideoError = useCallback(() => {
    logger.warn('Erro ao carregar vídeo da tecnologia completa', { section: 'CompleteTechnologySection' });
  }, []);

  return (
    <section id={id} className="section-standard px-4 md:px-6 lg:px-12 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20 space-y-6 lg:space-y-8">
          <div className="space-y-4">
            <h2 className="titulo-h2 px-4 sm:px-0">
              Como funciona a tecnologia
              <span className="block text-accent">ASTRO QUAT V3®</span>
            </h2>
            <div className="h-1 bg-gradient-accent mx-auto w-24"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="subtitulo-premium">
              Um processo revolucionário em quatro etapas precisas que transforma a estrutura capilar sem agressões químicas.
            </p>
          </div>
        </div>

        {/* Technology Flow - Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Process Steps - Left */}
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-primary font-montserrat mb-8 text-center lg:text-left">
              Processo Molecular Avançado
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {processSteps.map((step, index) => (
                <Card key={step.number} className="card-interactive group relative overflow-hidden">
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-80 transition-opacity duration-300",
                    step.gradient
                  )}></div>
                  
                  {/* Step Number - Positioned in top-left corner */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-200 shadow-lg">
                    <span className="font-bold text-sm text-brand-black font-montserrat">
                      {step.number}
                    </span>
                  </div>
                  
                  <div className="relative p-4 lg:p-6 pt-6 lg:pt-8 space-y-4">
                    {/* Title */}
                    <h4 className="titulo-h3 text-center lg:text-left">
                      {step.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Badge */}
                    <div className="flex justify-center lg:justify-start">
                      <Badge variant="secondary" className="text-xs">
                        {step.badge}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Video Player - Right */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover transition-elegant duration-500">
                <VideoLazy
                  src="https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/videos//tecnologia-oficial-compactado.mp4"
                  className="w-full aspect-[4/3] object-cover"
                  autoPlay={false}
                  muted={true}
                  loop={true}
                  controls={true}
                  preload="none"
                  threshold={0.5}
                  rootMargin="50px"
                  title="Demonstração da Tecnologia ASTRO QUAT V3® em ação"
                  onError={handleVideoError}
                />
              </div>
              
              {/* Decorative glow effect */}
              <div className="absolute inset-0 bg-gradient-accent/10 rounded-xl blur-lg -z-10 scale-110"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CompleteTechnologySection.displayName = 'CompleteTechnologySection';

export { CompleteTechnologySection };
export default CompleteTechnologySection;