import React, { memo, useCallback } from 'react';
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AnimatedSection } from "@/components/ui/animated-section";
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
      className="section-standard bg-gradient-subtle"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection animation="fade" className="text-center mb-12 md:mb-16 lg:mb-20 space-y-6 lg:space-y-8">
          <div className="space-y-4">
            <h2 className="titulo-h2">
              Ativos da Amazônia
            </h2>
            <div className="h-1 bg-gradient-accent mx-auto w-24"></div>
          </div>
        </AnimatedSection>

        {/* Ingredients Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {amazonIngredients.map((ingredient, index) => (
            <div 
              key={ingredient.name}
              className={cn(
                "card-interactive p-6 h-full",
                `bg-gradient-to-br ${ingredient.bgGradient}`
              )}
            >
              <div className="relative z-10 space-y-4">
                <h3 className="titulo-h3 uppercase">
                  {ingredient.name}
                </h3>
                <p className="text-sm text-muted-foreground italic">
                  {ingredient.scientificName}
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {ingredient.description}
                </p>
                <div className={cn("inline-flex items-center text-sm font-medium", ingredient.originColor)}>
                  • {ingredient.origin}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

AmazonIngredientsSection.displayName = "AmazonIngredientsSection";

export { AmazonIngredientsSection };
export default AmazonIngredientsSection;