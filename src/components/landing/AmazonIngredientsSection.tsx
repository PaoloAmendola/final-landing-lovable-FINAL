import { memo } from "react";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { cn } from "@/lib/utils";

interface AmazonIngredientsSectionProps {
  id?: string;
}

const amazonIngredients = [
  {
    name: "MURUMURU",
    scientificName: "Astrocaryum murumuru",
    description: "Manteiga preciosa que restaura e sela as cutículas dos fios, proporcionando proteção duradoura.",
    origin: "Floresta Amazônica",
    bgGradient: "from-green-500/10 to-emerald-600/15",
    originColor: "text-emerald-600"
  },
  {
    name: "CUPUAÇU", 
    scientificName: "Theobroma grandiflorum",
    description: "Hidratação profunda e prolongada, criando uma barreira protetora contra ressecamento.",
    origin: "Floresta Amazônica",
    bgGradient: "from-amber-500/10 to-yellow-600/15",
    originColor: "text-emerald-600"
  },
  {
    name: "ROMÃ",
    scientificName: "Punica granatum", 
    description: "Antioxidante potente que combate os radicais livres, preservando a cor e vitalidade.",
    origin: "Floresta Asiática",
    bgGradient: "from-red-500/10 to-pink-600/15",
    originColor: "text-red-600"
  }
];

const AmazonIngredientsSection = memo(({ id }: AmazonIngredientsSectionProps) => {
  return (
    <section 
      id={id}
      className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-br from-muted/30 via-background to-background"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection animation="fade" className="text-center mb-12 md:mb-16 lg:mb-20">
          <div className="space-y-4">
            <h2 className="heading-2 text-primary">
              Ativos da Amazônia
            </h2>
            <div className="h-1 bg-gradient-accent mx-auto w-20 md:w-24"></div>
          </div>
        </AnimatedSection>

        {/* Ingredients Cards */}
        <StaggerContainer staggerDelay={0.1} childAnimation="slide-up" className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {amazonIngredients.map((ingredient, index) => (
            <Card 
              key={ingredient.name}
              className={cn(
                "relative p-6 md:p-8 transition-all duration-500 hover:border-accent/40 hover:scale-[1.02] hover:-translate-y-2 shadow-card hover:shadow-card-hover",
                `bg-gradient-to-br ${ingredient.bgGradient} border-primary/20`
              )}
            >
              <div className="relative z-10 space-y-4">
                <h3 className="heading-4 text-foreground uppercase tracking-wide">
                  {ingredient.name}
                </h3>
                <p className="body-sm text-muted-foreground italic">
                  {ingredient.scientificName}
                </p>
                <p className="body-base text-muted-foreground leading-relaxed">
                  {ingredient.description}
                </p>
                <div className={cn("inline-flex items-center gap-2 text-sm font-medium", ingredient.originColor)}>
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  {ingredient.origin}
                </div>
              </div>
            </Card>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
});

AmazonIngredientsSection.displayName = "AmazonIngredientsSection";

export { AmazonIngredientsSection };
export default AmazonIngredientsSection;