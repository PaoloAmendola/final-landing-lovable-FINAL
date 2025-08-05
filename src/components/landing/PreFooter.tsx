interface PreFooterProps {
  id?: string;
}

const PreFooter = ({ id }: PreFooterProps) => {
  return (
    <section id={id} className="py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <h3 className="heading-2 text-primary">
            Conheça nossa loja oficial
          </h3>
          <div className="max-w-2xl mx-auto">
            <p className="body-lg text-muted-foreground leading-relaxed">
              Acesse nossa plataforma exclusiva para profissionais
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <a
            href="https://www.bembeauty.com.br/collections/nivela"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-5 rounded-xl font-bold text-lg text-brand-black bg-gradient-accent hover:scale-105 active:scale-95 transition-all duration-300 shadow-premium hover:shadow-card-hover border-2 border-brand-caramel/20 min-h-[56px]"
          >
            ACESSAR LOJA OFICIAL
          </a>
        </div>
      </div>
    </section>
  );
};

export default PreFooter;