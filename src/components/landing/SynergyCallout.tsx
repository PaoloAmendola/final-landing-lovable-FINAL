import { memo } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

interface SynergyCalloutProps {
  id?: string;
  className?: string;
}

const SynergyCallout = memo(({ id, className }: SynergyCalloutProps) => {
  return (
    <section 
      id={id}
      className={cn("section-standard bg-gradient-subtle", className)}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12">
        <AnimatedSection animation="scale">
          <div className="relative p-8 md:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-muted/10 border border-primary/10 shadow-elegant overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-primary to-primary/50 rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-secondary to-secondary/50 rounded-full blur-2xl" />
            </div>
            
            <div className="relative z-10 text-center space-y-6">
              <h2 className="titulo-h2 text-foreground">
                A{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  Sinergia Perfeita
                </span>
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="subtitulo-premium">
                  Quando a precisão molecular da tecnologia{" "}
                  <span className="font-semibold text-foreground">ASTRO QUAT V3®</span>{" "}
                  encontra a pureza dos ativos amazônicos, nasce uma revolução capilar que transforma fios em{" "}
                  <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    obras de arte naturais
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

SynergyCallout.displayName = "SynergyCallout";

export { SynergyCallout };
export default SynergyCallout;