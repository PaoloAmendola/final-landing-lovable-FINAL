-- Primeira, vamos ajustar a tabela leads para refletir o novo campo de tipo de estabelecimento
-- Adicionar uma coluna mais específica e eventualmente remover a antiga
ALTER TABLE public.leads 
ADD COLUMN tipo_estabelecimento TEXT;

-- Atualizar os dados existentes para manter consistência
UPDATE public.leads 
SET tipo_estabelecimento = empresa 
WHERE empresa IS NOT NULL;

-- Agora remover a coluna antiga empresa
ALTER TABLE public.leads 
DROP COLUMN empresa;

-- Adicionar constraint para garantir que tipo_estabelecimento seja uma das opções válidas
ALTER TABLE public.leads 
ADD CONSTRAINT check_tipo_estabelecimento 
CHECK (tipo_estabelecimento IN (
  'salao-proprio', 
  'salao-terceiros', 
  'atendimento-domiciliar', 
  'studio-compartilhado', 
  'freelancer'
));

-- Criar a nova tabela para distribuidores
CREATE TABLE public.distribuidores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  empresa TEXT NOT NULL,
  cargo TEXT,
  mensagem TEXT,
  cidade TEXT,
  estado TEXT,
  experiencia_distribuicao TEXT,
  volume_vendas_mensal TEXT
);

-- Habilitar Row Level Security na tabela distribuidores
ALTER TABLE public.distribuidores ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir inserção pública (qualquer pessoa pode se candidatar)
CREATE POLICY "Qualquer pessoa pode inserir candidatura de distribuidor" 
ON public.distribuidores 
FOR INSERT 
WITH CHECK (true);

-- Criar política para admins visualizarem distribuidores (desabilitada por enquanto pois não temos auth)
CREATE POLICY "Admins podem visualizar distribuidores" 
ON public.distribuidores 
FOR SELECT 
USING (false);

-- Adicionar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_distribuidores_updated_at
BEFORE UPDATE ON public.distribuidores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar índices para performance
CREATE INDEX idx_distribuidores_email ON public.distribuidores(email);
CREATE INDEX idx_distribuidores_created_at ON public.distribuidores(created_at);
CREATE INDEX idx_distribuidores_estado ON public.distribuidores(estado);