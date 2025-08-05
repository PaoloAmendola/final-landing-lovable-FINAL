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
      className={cn("relative py-16 md:py-20 lg:py-24", className)}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <AnimatedSection animation="scale" className="max-w-5xl mx-auto">
          <div className="relative p-10 md:p-16 lg:p-20 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-muted/10 border border-primary/10 shadow-elegant overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-primary to-primary/50 rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-secondary to-secondary/50 rounded-full blur-2xl" />
            </div>
            
            <div className="relative z-10 text-center space-y-8">
              <h2 className="heading-1 text-foreground">
                A{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  Sinergia Perfeita
                </span>
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="body-lg text-muted-foreground leading-relaxed">
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