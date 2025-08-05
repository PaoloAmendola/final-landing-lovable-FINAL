import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, GraduationCap, Briefcase, Bot } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { StaggerContainer } from "@/components/ui/stagger-container";

interface BemTechSectionProps {
  id?: string;
}

const BemTechSection = memo(({ id }: BemTechSectionProps) => {
  const technologies = [
    {
      name: "BemHUB™",
      subtitle: "Central estratégica do distribuidor",
      features: [
        "Guia interativo do produto",
        "Treinamentos com quiz e certificado",
        "Scripts, objeções e argumentos prontos para usar",
        "Materiais de marketing para ativar salões",
        "Provas sociais e apresentações visuais"
      ],
      impact: "Opere com autonomia e autoridade.",
    },
    {
      name: "BemEDUCA™",
      subtitle: "Treinamento imersivo e inteligente", 
      features: [
        "Módulos curtos e objetivos",
        "Técnicas consultivas e quebra de objeções",
        "Treinamento inteligente por perfil de cliente",
        "IA integrada (BEMBOT™) como assistente de suporte"
      ],
      impact: "Equipes mais seguras e clientes mais fiéis.",
    },
    {
      name: "BemPRO™",
      subtitle: "Consultor digital do cabeleireiro moderno",
      features: [
        "Guia técnico completo de aplicação",
        "Ficha de anamnese digital + histórico de clientes",
        "Biblioteca com artigos, tricologia e tendências",
        "Materiais prontos para redes sociais",
        "IA para recomendar, resolver dúvidas e apoiar no dia a dia"
      ],
      impact: "A confiança técnica que o cabeleireiro precisa.",
    },
  ];

  return (
    <section id={id} className="py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AnimatedSection animation="fade" delay={0.2}>
            <div className="text-center mb-12 md:mb-16 lg:mb-20 space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center bg-accent/20 border-2 border-accent/40 rounded-full px-6 py-3 mb-4 shadow-elegant">
                  <span className="body-base font-bold text-accent tracking-wide">
                    BÔNUS Exclusivo para Clientes NIVELA®
                  </span>
                </div>
                <h2 className="heading-2 text-white">
                  BemTech™ Ecosystem
                </h2>
                <div className="h-1 bg-gradient-accent mx-auto w-20 md:w-24"></div>
              </div>
              <h3 className="heading-3 text-primary/90">
                O primeiro ecossistema digital do setor de beleza
              </h3>
              <div className="max-w-4xl mx-auto">
                <p className="body-lg text-muted-foreground leading-relaxed">
                  Uma infraestrutura completa de apoio ao cabeleireiro e ao distribuidor. 
                  Um conjunto de apps inteligentes com IA integrada, que coloca conhecimento, 
                  treinamento e suporte na palma da mão.
                </p>
              </div>
            </div>
        </AnimatedSection>

        {/* Technologies Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-16 lg:mb-20" staggerDelay={0.2}>
          {technologies.map((tech, index) => {
            return (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-accent/50 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 group shadow-card hover:shadow-card-hover">
                  <CardContent className="p-6 md:p-8 lg:p-10 space-y-5 lg:space-y-6 text-center">
                    {/* Title and Subtitle */}
                    <div className="space-y-3">
                      <h4 className="heading-3 text-primary">
                        {tech.name}
                      </h4>
                      <p className="body-lg text-accent">
                        {tech.subtitle}
                      </p>
                    </div>
                    
                    {/* Features */}
                    <ul className="space-y-3 text-left" role="list">
                      {tech.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" aria-hidden="true"></div>
                          <span className="body-base text-muted-foreground leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Impact Badge */}
                    <div className="pt-4 flex justify-center">
                      <div className="inline-flex items-center justify-center bg-primary/10 border border-primary/20 rounded-full px-5 py-3">
                        <span className="body-base font-medium text-primary/80 italic">
                          {tech.impact}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </StaggerContainer>

        {/* BemBOT Horizontal Block */}
        <div className="mb-16 lg:mb-20">
          <Card className="bg-card/20 backdrop-blur-sm border border-primary/10 shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-500 group">
            <CardContent className="p-8 md:p-12 lg:p-16">
              <div className="text-center space-y-6 lg:space-y-8">
                {/* Bot Icon */}
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-tech-accent rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Bot className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-primary" aria-hidden="true" />
                </div>
                
                {/* Content */}
                <div className="space-y-4 lg:space-y-6">
                  <h4 className="heading-3 text-primary">BemBOT™</h4>
                  <div className="max-w-4xl mx-auto">
                    <p className="body-lg text-muted-foreground leading-relaxed">
                      <strong className="text-accent">BemBOT™</strong> é a inteligência que conecta todo o ecossistema. 
                      Presente em todos os módulos, entrega suporte personalizado, respostas instantâneas e aprendizado contínuo.
                    </p>
                  </div>
                  <p className="body-lg text-accent font-medium italic">
                    O suporte que nunca dorme.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Section */}
        <div className="text-center space-y-6 pt-12 lg:pt-16">
          <h3 className="heading-2 text-primary">
            Tudo conectado. Tudo BemTech™
          </h3>
          <div className="max-w-3xl mx-auto">
            <p className="body-lg text-muted-foreground leading-relaxed">
              <strong>Distribuidores mais preparados. Equipes mais confiantes. Cabeleireiros mais seguros.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

BemTechSection.displayName = 'BemTechSection';

export default BemTechSection;