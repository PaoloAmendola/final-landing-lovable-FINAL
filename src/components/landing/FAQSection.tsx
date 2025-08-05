import { memo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";

interface FAQSectionProps {
  id?: string;
}

const FAQSection = memo(({ id }: FAQSectionProps) => {
  const faqs = [
    {
      question: "NIVELA® é realmente livre de formol?",
      answer: "Absolutamente. NIVELA® utiliza a tecnologia patenteada ASTRO QUAT V3®, completamente livre de formol, formaldeído ou qualquer substância similar.",
    },
    {
      question: "Qual o diferencial da textura em gel?", 
      answer: "A textura gel inteligente proporciona 30% mais rendimento comparado aos cremes convencionais, além de facilitar a aplicação uniforme e reduzir o desperdício, otimizando seu investimento.",
    },
    {
      question: "NIVELA® funciona em todos os tipos de cabelo?",
      answer: "Sim. A tecnologia ASTRO QUAT V3® foi desenvolvida para ser eficaz em todos os tipos de cabelo, desde os mais resistentes até os mais sensibilizados, sempre respeitando a estrutura natural dos fios.",
    },
    {
      question: "É necessário treinamento específico?",
      answer: "Embora NIVELA® seja de fácil aplicação, oferecemos acesso completo ao ecossistema BemTech™, incluindo treinamentos especializados, suporte técnico e materiais didáticos exclusivos.",
    },
    {
      question: "Como funciona o suporte técnico?",
      answer: "Você terá acesso 24/7 ao BEMBOT™, nossa IA especializada, além de suporte direto via WhatsApp e acesso ao portal exclusivo com materiais técnicos e comerciais.",
    },
    {
      question: "NIVELA® pode ser usado com outros tratamentos?",
      answer: "Sim, NIVELA® é compatível com colorações, luzes e outros tratamentos químicos, sempre respeitando os intervalos adequados e protocolos de segurança.",
    },
    {
      question: "Como me torno um profissional autorizado?",
      answer: "O acesso a NIVELA® é exclusivo para profissionais qualificados. Complete nosso formulário de cadastro para avaliação e aprovação da sua candidatura.",
    },
    {
      question: "Existe suporte para marketing e vendas?",
      answer: "Sim! O ecossistema BemTech™ inclui materiais prontos para redes sociais, scripts de vendas, campanhas e tudo que você precisa para potencializar seus resultados comerciais.",
    },
  ];

  return (
    <section id={id} className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 bg-gradient-subtle">
      <div className="max-w-4xl mx-auto">
        {/* Header - Responsividade otimizada */}
        <div className="text-center mb-12 md:mb-16 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Perguntas Frequentes
            </h2>
            <div className="h-1 bg-gradient-accent mx-auto w-16"></div>
          </div>
        </div>

        {/* FAQ Accordion - Touch targets otimizados */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="group border border-primary/20 rounded-xl px-6 py-2 hover:border-accent/40 hover:bg-primary/5 hover:scale-[1.01] transition-all duration-300 ease-out shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <AccordionTrigger className="text-left font-semibold text-lg text-primary group-hover:text-accent transition-all duration-300 ease-out py-6 min-h-[56px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 max-w-3xl">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Final - Mobile otimizado */}
        <div className="mt-16 text-center space-y-8">
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ainda tem dúvidas? Nossa equipe especializada está pronta para ajudar.
          </p>
          <a 
            href="https://wa.me/552139500901"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full sm:w-auto min-w-[280px] max-w-sm text-lg px-8 py-4 rounded-xl hover:scale-105 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none transition-all duration-300 ease-out bg-gradient-primary text-white font-semibold min-h-[56px]"
            aria-label="Falar com especialista no WhatsApp"
          >
            FALAR COM ESPECIALISTA
          </a>
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = 'FAQSection';

export default FAQSection;