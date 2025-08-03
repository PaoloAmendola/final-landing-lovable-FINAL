interface PreFooterProps {
  id?: string;
}

const PreFooter = ({ id }: PreFooterProps) => {
  return (
    <section id={id} className="py-20 lg:py-24 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary font-montserrat">
            Conheça nossa loja oficial
          </h3>
          <p className="text-lg lg:text-xl text-muted-foreground font-montserrat">
            Acesse nossa plataforma exclusiva para profissionais
          </p>
        </div>
        
        <div className="flex justify-center">
          <a
            href="https://www.bembeauty.com.br/collections/nivela"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg text-brand-black bg-gradient-accent hover:scale-105 active:scale-95 transition-elegant duration-300 shadow-premium hover:shadow-card-hover border-2 border-brand-caramel/20"
          >
            ACESSAR LOJA OFICIAL
          </a>
        </div>
      </div>
    </section>
  );
};

export default PreFooter;