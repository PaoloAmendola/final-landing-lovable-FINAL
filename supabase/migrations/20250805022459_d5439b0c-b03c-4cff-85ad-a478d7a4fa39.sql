-- Criar tabela para candidaturas de distribuidores
CREATE TABLE public.distribuidores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cidade TEXT NOT NULL,
  ja_distribui TEXT NOT NULL CHECK (ja_distribui IN ('sim', 'nao')),
  empresa TEXT,
  apresentacao TEXT,
  ip_address INET,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado')),
  origem TEXT DEFAULT 'landing_page',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.distribuidores ENABLE ROW LEVEL SECURITY;

-- Criar política para inserção pública (qualquer pessoa pode se candidatar)
CREATE POLICY "Permite inserção de candidaturas de distribuidores" 
ON public.distribuidores 
FOR INSERT 
WITH CHECK (true);

-- Criar política para visualização apenas por administradores
CREATE POLICY "Apenas administradores podem visualizar distribuidores" 
ON public.distribuidores 
FOR SELECT 
USING (false);

-- Criar trigger para atualização automática do updated_at
CREATE TRIGGER update_distribuidores_updated_at
BEFORE UPDATE ON public.distribuidores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_leads();

-- Criar índices para melhor performance
CREATE INDEX idx_distribuidores_email ON public.distribuidores(email);
CREATE INDEX idx_distribuidores_status ON public.distribuidores(status);
CREATE INDEX idx_distribuidores_created_at ON public.distribuidores(created_at);
CREATE INDEX idx_distribuidores_cidade ON public.distribuidores(cidade);