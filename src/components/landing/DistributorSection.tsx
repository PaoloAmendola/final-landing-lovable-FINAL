import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Store, 
  TrendingUp, 
  Shield, 
  Users, 
  Target,
  CheckCircle2
} from "lucide-react";

interface DistributorSectionProps {
  id?: string;
}

const DistributorSection = ({ id }: DistributorSectionProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidade: "",
    ja_distribui: "",
    empresa: "",
    apresentacao: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('distribuidores')
        .insert({
          nome: formData.nome.trim(),
          telefone: formData.telefone.trim() || null,
          email: formData.email.trim(),
          cidade: formData.cidade.trim() || null,
          empresa: formData.empresa.trim() || 'Não informado',
          mensagem: formData.apresentacao.trim() || null,
          experiencia_distribuicao: formData.ja_distribui || null,
          estado: null,
          volume_vendas_mensal: null,
          cargo: null
        });

      if (error) {
        // Error handled silently in production
        toast.error('Erro ao enviar solicitação. Tente novamente.');
      } else {
        setIsSubmitted(true);
        toast.success('Solicitação enviada com sucesso!');
      }
    } catch (error) {
      // Error handled silently in production
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRadioChange = (value: string) => {
    setFormData({
      ...formData,
      ja_distribui: value
    });
  };

  if (isSubmitted) {
    return (
      <section id={id} className="py-20 lg:py-24 px-6 lg:px-12 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-3xl p-12 lg:p-16 space-y-8 shadow-card">
            <div className="w-32 h-32 bg-gradient-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-16 h-16 text-brand-black" aria-hidden="true" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold text-primary font-montserrat">
                Candidatura Enviada com Sucesso!
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Recebemos sua candidatura para se tornar um distribuidor <strong className="text-brand-caramel">Bem Beauty Professional</strong>.
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-left space-y-4">
                <h3 className="text-lg font-bold text-primary font-montserrat">Próximos passos:</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-caramel rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Análise da candidatura</strong> - Nossa equipe analisará seu perfil em até 48 horas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-caramel rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Primeira reunião</strong> - Apresentação detalhada do modelo de distribuição</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-caramel rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Proposta comercial</strong> - Condições e valores personalizados para sua região</span>
                  </li>
                </ul>
              </div>
              <p className="text-lg text-brand-caramel font-semibold">
                Bem-vindo à revolução da beleza profissional! 🎉
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const benefits = [
    {
      icon: Store,
      title: "Marca Premium",
      description: "Represente uma marca reconhecida no mercado profissional"
    },
    {
      icon: TrendingUp,
      title: "Alto Potencial",
      description: "Mercado em crescimento com margens atrativas"
    },
    {
      icon: Shield,
      title: "Suporte Completo",
      description: "Treinamento, marketing e suporte técnico incluído"
    },
    {
      icon: Users,
      title: "Rede Exclusiva",
      description: "Faça parte de uma rede seleta de distribuidores"
    }
  ];

  return (
    <section id={id} className="py-20 lg:py-24 px-6 lg:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="mx-auto bg-primary/10 border-primary/20 text-primary/80">
            OPORTUNIDADE EXCLUSIVA
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat text-white tracking-tight leading-[1.1]">
            Seja um Distribuidor
            <span className="block text-brand-caramel">Bem Beauty Professional</span>
          </h2>
          <div className="h-0.5 lg:h-1 bg-gradient-accent mx-auto w-16 lg:w-24"></div>
          <p className="text-lg lg:text-xl text-muted-foreground font-montserrat max-w-3xl mx-auto">
            Junte-se à revolução da beleza profissional. Distribua produtos premium com tecnologia patenteada e suporte completo para o seu sucesso.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Benefits Section */}
          <AnimatedSection animation="slide-right" className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-primary font-montserrat">
                Por que ser nosso distribuidor?
              </h3>
              
              <div className="grid gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary font-montserrat mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </AnimatedSection>

          {/* Form Section */}
          <AnimatedSection animation="slide-left">
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-primary font-montserrat">
                    Quero conhecer o modelo
                  </h3>
                  <p className="text-muted-foreground">
                    Preencha seus dados e receba informações detalhadas
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Campos obrigatórios */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dist-name" className="sr-only">Nome completo</label>
                      <Input
                        id="dist-name"
                        name="nome"
                        placeholder="Nome completo *"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        aria-label="Nome completo"
                        className="bg-background/50"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="dist-phone" className="sr-only">WhatsApp</label>
                      <Input
                        id="dist-phone"
                        name="telefone"
                        type="tel"
                        placeholder="WhatsApp *"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                        aria-label="Número do WhatsApp"
                        className="bg-background/50"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dist-email" className="sr-only">E-mail</label>
                      <Input
                        id="dist-email"
                        name="email"
                        type="email"
                        placeholder="E-mail *"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        aria-label="E-mail"
                        className="bg-background/50"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="dist-city" className="sr-only">Cidade</label>
                      <Input
                        id="dist-city"
                        name="cidade"
                        placeholder="Cidade *"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        required
                        aria-label="Cidade"
                        className="bg-background/50"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Pergunta sobre distribuição */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-primary">
                      Já distribui alguma marca? *
                    </Label>
                    <RadioGroup
                      value={formData.ja_distribui}
                      onValueChange={handleRadioChange}
                      className="flex gap-6"
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="sim" />
                        <Label htmlFor="sim" className="cursor-pointer">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="nao" />
                        <Label htmlFor="nao" className="cursor-pointer">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Campos opcionais */}
                  <div>
                    <label htmlFor="dist-company" className="sr-only">Empresa</label>
                    <Input
                      id="dist-company"
                      name="empresa"
                      placeholder="Empresa (opcional)"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      aria-label="Nome da empresa"
                      className="bg-background/50"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="dist-presentation" className="sr-only">Apresentação</label>
                    <Textarea
                      id="dist-presentation"
                      name="apresentacao"
                      placeholder="Faça uma breve apresentação (opcional)"
                      value={formData.apresentacao}
                      onChange={handleInputChange}
                      aria-label="Apresentação pessoal"
                      className="bg-background/50 min-h-[100px]"
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="premium"
                    size="lg"
                    className="w-full font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin"></div>
                        <span>Enviando candidatura...</span>
                      </div>
                    ) : (
                      "QUERO SER DISTRIBUIDOR"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Ao enviar, você concorda em receber informações sobre nossa oportunidade de distribuição.
                  </p>
                </form>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default DistributorSection;