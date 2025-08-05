interface PreFooterProps {
  id?: string;
}

const PreFooter = ({ id }: PreFooterProps) => {
  return (
    <section id={id} className="section-standard bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 text-center space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="titulo-h2">
              Conheça nossa loja oficial
            </h3>
            <div className="h-1 bg-gradient-accent mx-auto w-24"></div>
          </div>
          <p className="subtitulo-premium">
            Acesse nossa plataforma exclusiva para profissionais
          </p>
        </div>
        
        <div className="flex justify-center">
          <a
            href="https://www.bembeauty.com.br/collections/nivela"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            ACESSAR LOJA OFICIAL
          </a>
        </div>
      </div>
    </section>
  );
};

export default PreFooter;