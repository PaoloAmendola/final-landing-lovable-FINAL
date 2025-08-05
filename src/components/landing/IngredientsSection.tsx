import { memo } from 'react';
import { LazyImage } from "@/components/ui/image-lazy";

interface IngredientsSectionProps {
  id?: string;
}

const IngredientsSection = memo(({ id }: IngredientsSectionProps) => {
  const ingredients = [
    {
      name: "MURUMURU",
      scientificName: "Astrocaryum murumuru",
      description: "Manteiga preciosa que restaura e sela as cutículas dos fios, proporcionando proteção duradoura e brilho natural intenso.",
      image: "/lovable-uploads/d6d587a3-e356-459e-b667-0abd987f7e21.png",
      altText: "Frutos de Murumuru, ingrediente natural da Amazônia",
      origin: "Floresta Amazônica",
    },
    {
      name: "CUPUAÇU",
      scientificName: "Theobroma grandiflorum",
      description: "Hidratação profunda e prolongada, criando uma barreira protetora contra ressecamento e agressões externas.",
      image: "/lovable-uploads/53c52afb-b182-46c2-b230-93a48b753bc3.png",
      altText: "Fruto de Cupuaçu cortado, ingrediente natural da Amazônia",
      origin: "Floresta Amazônica",
    },
    {
      name: "ROMÃ",
      scientificName: "Punica granatum",
      description: "Antioxidante potente que combate os radicais livres, preservando a cor e vitalidade dos cabelos.",
      image: "/lovable-uploads/2fc5c7fd-9740-405d-bd1d-50855bc94459.png",
      altText: "Romã cortada, ingrediente rico em antioxidantes",
      origin: "Nativa da Ásia",
    },
  ];

  return (
    <section id={id} className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20 space-modular-6">
          <div className="space-modular-4">
            <h2 className="heading-2 text-primary px-4 sm:px-0">
              Ativos da Amazônia
            </h2>
            <div className="h-1 bg-gradient-accent mx-auto w-24"></div>
          </div>
          <p className="body-lg text-primary/80 max-w-4xl mx-auto px-4 sm:px-0">
            Cada ativo foi cuidadosamente selecionado por suas propriedades excepcionais
          </p>
        </div>

        {/* Amazon Forest Image and Ingredients Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Amazon Forest Image */}
          <div className="w-full lg:w-1/2 flex-shrink-0 lg:h-fit">
            <div className="relative group h-full">
              <div className="relative overflow-hidden rounded-3xl shadow-card hover:shadow-card-hover transition-elegant duration-500 h-full lg:min-h-[750px] flex items-center">
                <LazyImage
                  src="/lovable-uploads/53c7ab29-5be3-441c-9618-051a8cdec3b3.png"
                  alt="Ativos naturais da Amazônia - Ingredientes premium do NIVELA"
                  className="w-full h-full lg:min-h-[750px] object-cover"
                  width={600}
                  height={750}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/30 to-transparent"></div>
              </div>
              {/* Forest glow effect */}
              <div className="absolute inset-0 bg-gradient-accent/15 rounded-3xl blur-2xl -z-10 scale-75"></div>
            </div>
          </div>

          {/* Ingredients Cards */}
          <div className="w-full lg:w-1/2 space-modular-6">
            {ingredients.map((ingredient, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl padding-modular-6 backdrop-blur-sm hover:bg-primary/15 hover:border-accent/30 hover:scale-[1.02] hover:-translate-y-1 transition-elegant duration-300 shadow-card hover:shadow-card-hover touch-target-enhanced"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-modular-4">
                  <div className="space-y-2">
                    <h3 className="heading-3 text-primary">
                      {ingredient.name}
                    </h3>
                    <p className="body-base italic text-primary/70">
                      {ingredient.scientificName}
                    </p>
                  </div>
                  
                  <p className="body-base text-primary/90">
                    {ingredient.description}
                  </p>
                  
                  <div className="pt-1">
                    <div className="inline-flex items-center space-x-2 body-sm text-accent">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="font-medium">Origem: {ingredient.origin}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

IngredientsSection.displayName = 'IngredientsSection';

export default IngredientsSection;