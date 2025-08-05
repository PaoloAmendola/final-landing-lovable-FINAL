import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoLazy } from "@/components/ui/video-lazy";
import { AnimatedSection } from "@/components/ui/animated-section";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { cn } from "@/lib/utils";

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
  const handleVideoError = () => {
    // Video error handled silently
  };

  return (
    <section 
      id={id}
      className="section-standard bg-gradient-subtle"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection animation="fade" className="text-center mb-12 md:mb-16 lg:mb-20 space-y-6 lg:space-y-8">
          <div className="space-y-4">
            <h2 className="titulo-h2">
              Tecnologia{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ASTRO QUAT V3®
              </span>
            </h2>
            <div className="h-1 bg-gradient-accent mx-auto w-24"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="subtitulo-premium">
              Desenvolvida por pesquisa molecular avançada, a tecnologia ASTRO QUAT V3® atua em escala nanométrica, 
              reorganizando as ligações internas da fibra capilar com precisão e segurança, totalmente livre de formol.
            </p>
          </div>
        </AnimatedSection>

        {/* Video Player - Mobile: Appears after header */}
        <div className="lg:hidden mb-12 flex justify-center">
          <AnimatedSection animation="scale" className="w-full max-w-lg">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-elegant">
              <VideoLazy
                src="https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/videos//tecnologia-oficial-compactado.mp4"
                poster="/lovable-uploads/d6d587a3-e356-459e-b667-0abd987f7e21.png"
                autoPlay={false}
                muted
                loop
                controls
                className="w-full h-full object-cover"
                threshold={0.5}
                onError={handleVideoError}
                title="Tecnologia ASTRO QUAT V3® - Demonstração Molecular"
                preload="none"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Main Content - Desktop: Side by side */}
        <div className="lg:grid lg:grid-cols-2 section-spacing lg:items-start">
          {/* Process Cards Grid */}
          <StaggerContainer staggerDelay={0.15} className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 relative">
              {/* Flow indicators for desktop 2x2 grid */}
              <div className="hidden md:block absolute top-1/4 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-accent/60 to-accent/30 transform -translate-x-1/2 z-0"></div>
              <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-accent/60 to-accent/30 transform -translate-y-1/2 z-0"></div>

              {processSteps.map((step, index) => (
                <Card 
                  key={step.number}
                  className="card-interactive group relative z-10"
                >
                  <CardContent className="relative p-0">
                    {/* Step Number positioned half outside */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-brand-black font-bold text-sm shadow-lg group-hover:scale-105 transition-transform duration-200 z-20">
                      {step.number}
                    </div>
                    
                    <div className="p-6 pt-8 space-y-3">
                      <h3 className="titulo-h3 group-hover:text-accent transition-colors duration-200">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {step.description}
                      </p>
                      <Badge variant="secondary" className="mt-4 text-xs">
                        {step.badge}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </StaggerContainer>

          {/* Video Player - Desktop: Right side */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <AnimatedSection animation="scale" delay={0.3} className="w-full max-w-lg">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-elegant">
                <VideoLazy
                  src="https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/videos//tecnologia-oficial-compactado.mp4"
                  poster="/lovable-uploads/d6d587a3-e356-459e-b667-0abd987f7e21.png"
                  autoPlay={false}
                  muted
                  loop
                  controls={false}
                  className="w-full h-full object-cover"
                  threshold={0.5}
                  onError={handleVideoError}
                  title="Tecnologia ASTRO QUAT V3® - Demonstração Molecular"
                  preload="none"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
});

CompleteTechnologySection.displayName = "CompleteTechnologySection";

export { CompleteTechnologySection };
export default CompleteTechnologySection;