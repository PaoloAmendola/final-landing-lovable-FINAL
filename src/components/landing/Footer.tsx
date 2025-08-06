import { useState } from 'react';
import { Instagram, Youtube, MessageCircle, Mail, MapPin, Phone, ExternalLink, ChevronUp } from 'lucide-react';
import { useCurrentYear } from '@/hooks/use-current-year';

interface FooterProps {
  id?: string;
}

const Footer = ({ id }: FooterProps) => {
  const currentYear = useCurrentYear();
  const [email, setEmail] = useState('');
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsNewsletterLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsNewsletterLoading(false);
    setEmail('');
    // Could integrate with Supabase here for newsletter signup
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id={id} className="bg-gradient-to-b from-[#0D181C] to-[#0A1419] relative">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 right-6 lg:right-12 bg-gradient-to-r from-brand-caramel to-brand-latte p-3 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 group"
        aria-label="Voltar ao topo"
      >
        <ChevronUp className="h-5 w-5 text-white group-hover:text-brand-black transition-colors" />
      </button>

      {/* Main Footer Content */}
      <div className="px-6 lg:px-12 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Coluna 1 - Marca & Identidade */}
            <div className="space-y-6">
              <div className="space-y-4">
                <img 
                  src="/lovable-uploads/icone-bem-beauty.png" 
                  alt="Bem Beauty Professional" 
                  className="h-14 object-contain"
                  loading="lazy"
                  width="200"
                  height="56"
                />
                <p className="text-base font-montserrat text-brand-latte leading-relaxed">
                  Cosméticos capilares de alta performance para profissionais do setor da beleza.
                </p>
              </div>
              
              <div className="space-y-3">
                 <div className="flex items-start space-x-3">
                   <MapPin className="h-5 w-5 text-brand-caramel mt-0.5 flex-shrink-0" />
                   <p className="text-sm font-montserrat text-brand-cloud leading-relaxed">
                     Av. Cesário de Melo, nº 3006<br />
                     Campo Grande, RJ
                   </p>
                 </div>
              </div>

              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-brand-caramel/10 border border-brand-caramel/20 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-brand-caramel rounded-full"></div>
                <span className="text-xs font-montserrat font-medium text-brand-latte">SSL Seguro</span>
              </div>
            </div>

            {/* Coluna 2 - Navegação Interna */}
            <div className="space-y-6">
              <h4 className="text-xl font-montserrat font-semibold text-brand-latte">
                Navegação
              </h4>
              <nav className="space-y-3">
                {[
                  { label: 'Conheça o Nivela', target: 'produto' },
                  { label: 'Como Funciona', target: 'tecnologia' },
                  { label: 'Tecnologias', target: 'bemtech' },
                  { label: 'Depoimentos', target: 'faq' }
                ].map((item) => (
                  <button
                    key={item.target}
                    onClick={() => scrollToSection(item.target)}
                    className="block text-base font-montserrat text-brand-cloud hover:text-brand-latte transition-elegant group"
                  >
                    <span className="border-b border-transparent group-hover:border-brand-latte transition-elegant">
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Coluna 3 - Contato & Atendimento */}
            <div className="space-y-6">
              <h4 className="text-xl font-montserrat font-semibold text-brand-latte">
                Contato & Atendimento
              </h4>
              
              {/* CTA Principal */}
              <a
                href="https://wa.me/552139500901"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-caramel to-brand-latte px-6 py-3 rounded-xl font-montserrat font-semibold text-white hover:shadow-glow transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
                aria-label="Conversar no WhatsApp da Bem Beauty Professional"
              >
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Fale com a gente</span>
              </a>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-brand-caramel flex-shrink-0" />
                  <div>
                    <p className="text-sm font-montserrat font-medium text-brand-latte">WhatsApp</p>
                    <p className="text-sm font-montserrat text-brand-cloud">(21) 3950-0901</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-brand-caramel flex-shrink-0" />
                  <div>
                    <p className="text-sm font-montserrat font-medium text-brand-latte">E-mail</p>
                    <a 
                      href="mailto:comercial@bembeauty.com.br" 
                      className="text-sm font-montserrat text-brand-cloud hover:text-brand-latte transition-elegant"
                    >
                      comercial@bembeauty.com.br
                    </a>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-brand-caramel/10 border border-brand-caramel/20 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-brand-caramel rounded-full"></div>
                <span className="text-xs font-montserrat font-medium text-brand-latte">Atendimento Profissional</span>
              </div>
            </div>

            {/* Coluna 4 - Redes Sociais & Newsletter */}
            <div className="space-y-6">
              <h4 className="text-xl font-montserrat font-semibold text-brand-latte">
                Redes Sociais
              </h4>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/bembeautyprofessional"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-brand-caramel/10 border border-brand-caramel/20 rounded-xl hover:bg-brand-caramel/20 hover:border-brand-caramel/40 transition-all duration-300 hover:scale-105 group"
                  aria-label="Seguir no Instagram"
                >
                  <Instagram className="h-5 w-5 text-brand-caramel group-hover:text-brand-latte transition-colors" />
                </a>
                <a
                  href="https://youtube.com/@BemBeautyProfessional"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-brand-caramel/10 border border-brand-caramel/20 rounded-xl hover:bg-brand-caramel/20 hover:border-brand-caramel/40 transition-all duration-300 hover:scale-105 group"
                  aria-label="Acompanhar no YouTube"
                >
                  <Youtube className="h-5 w-5 text-brand-caramel group-hover:text-brand-latte transition-colors" />
                </a>
                <a
                  href="https://wa.me/552139500901"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-brand-caramel/10 border border-brand-caramel/20 rounded-xl hover:bg-brand-caramel/20 hover:border-brand-caramel/40 transition-all duration-300 hover:scale-105 group"
                  aria-label="Conversar no WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 text-brand-caramel group-hover:text-brand-latte transition-colors" />
                </a>
              </div>

              {/* Newsletter */}
              <div className="space-y-4">
                <h5 className="text-lg font-montserrat font-medium text-brand-latte">
                  Newsletter
                </h5>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Receba novidades exclusivas"
                    className="w-full px-4 py-3 bg-brand-black/50 border border-brand-caramel/20 rounded-xl font-montserrat text-brand-latte placeholder:text-brand-cloud/60 focus:outline-none focus:border-brand-caramel/60 focus:ring-2 focus:ring-brand-caramel/20 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isNewsletterLoading}
                    className="w-full bg-gradient-to-r from-brand-caramel/80 to-brand-latte/80 hover:from-brand-caramel hover:to-brand-latte px-4 py-3 rounded-xl font-montserrat font-medium text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isNewsletterLoading ? 'Aguarde...' : 'Quero receber'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Legal Links */}
      <div className="px-6 lg:px-12 py-8 border-t border-brand-caramel/10 bg-[#0A1419]">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
             <div className="text-center md:text-left space-y-1">
               <p className="text-base font-montserrat text-brand-cloud/80">
                 © {currentYear} Bem Beauty Professional Ltda. Todos os direitos reservados.
               </p>
               <p className="text-xs font-montserrat text-brand-cloud/60">
                 CNPJ: 51.635.148/0001-33
               </p>
             </div>
             <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
               <a
                 href="https://bembeauty.com.br/politica-de-privacidade"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-sm font-montserrat text-brand-cloud hover:text-brand-latte transition-elegant inline-flex items-center space-x-1"
               >
                 <span>Política de Privacidade</span>
                 <ExternalLink className="h-3 w-3" />
               </a>
               <a
                 href="https://bembeauty.com.br/termos-de-uso"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-sm font-montserrat text-brand-cloud hover:text-brand-latte transition-elegant inline-flex items-center space-x-1"
               >
                 <span>Termos de Uso</span>
                 <ExternalLink className="h-3 w-3" />
               </a>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;