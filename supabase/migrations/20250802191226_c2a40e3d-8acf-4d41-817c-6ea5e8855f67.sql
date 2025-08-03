-- Primeiro, vamos verificar e ajustar os dados existentes na tabela leads
-- Adicionar a nova coluna tipo_estabelecimento
ALTER TABLE public.leads 
ADD COLUMN tipo_estabelecimento TEXT;

-- Migrar dados existentes da coluna empresa para tipo_estabelecimento
-- Mapear valores existentes para as opções válidas ou usar um valor padrão
UPDATE public.leads 
SET tipo_estabelecimento = CASE 
  WHEN empresa IS NULL OR empresa = '' THEN 'salao-terceiros'
  WHEN LOWER(empresa) LIKE '%próprio%' OR LOWER(empresa) LIKE '%proprio%' THEN 'salao-proprio'
  WHEN LOWER(empresa) LIKE '%domicil%' OR LOWER(empresa) LIKE '%casa%' THEN 'atendimento-domiciliar'
  WHEN LOWER(empresa) LIKE '%studio%' OR LOWER(empresa) LIKE '%compartilh%' THEN 'studio-compartilhado'
  WHEN LOWER(empresa) LIKE '%freelan%' OR LOWER(empresa) LIKE '%autônom%' THEN 'freelancer'
  ELSE 'salao-terceiros' -- valor padrão para casos não mapeados
END;

-- Garantir que não há valores nulos
UPDATE public.leads 
SET tipo_estabelecimento = 'salao-terceiros' 
WHERE tipo_estabelecimento IS NULL;

-- Agora podemos adicionar a constraint com segurança
ALTER TABLE public.leads 
ADD CONSTRAINT check_tipo_estabelecimento 
CHECK (tipo_estabelecimento IN (
  'salao-proprio', 
  'salao-terceiros', 
  'atendimento-domiciliar', 
  'studio-compartilhado', 
  'freelancer'
));

-- Remover a coluna empresa antiga
ALTER TABLE public.leads 
DROP COLUMN empresa;

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