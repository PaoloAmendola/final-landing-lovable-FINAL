-- Criação da tabela de leads otimizada para NIVELA®
CREATE TABLE IF NOT EXISTS public.leads_nivela (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL CHECK (length(trim(nome)) >= 2),
  email TEXT NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  telefone TEXT NOT NULL CHECK (length(regexp_replace(telefone, '[^0-9]', '', 'g')) BETWEEN 10 AND 11),
  tipo_estabelecimento TEXT NOT NULL CHECK (tipo_estabelecimento IN (
    'salao-proprio', 
    'salao-terceiros', 
    'atendimento-domiciliar', 
    'studio-compartilhado', 
    'freelancer'
  )),
  
  -- Campos de rastreamento e analytics
  utm_source TEXT,
  utm_medium TEXT, 
  utm_campaign TEXT,
  user_agent TEXT,
  ip_address INET,
  
  -- Campos de controle
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'contatado', 'qualificado', 'convertido')),
  origem TEXT DEFAULT 'landing_page',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.leads_nivela ENABLE ROW LEVEL SECURITY;

-- Política para inserção (permite inserções sem autenticação para o formulário)
CREATE POLICY "Permite inserção de leads" 
ON public.leads_nivela 
FOR INSERT 
WITH CHECK (true);

-- Política para visualização (apenas administradores - quando implementado)
CREATE POLICY "Apenas administradores podem visualizar leads" 
ON public.leads_nivela 
FOR SELECT 
USING (false); -- Bloqueia por enquanto, será atualizado quando houver autenticação

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads_nivela(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads_nivela(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads_nivela(status);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON public.leads_nivela(utm_source);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_leads()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_nivela_updated_at
  BEFORE UPDATE ON public.leads_nivela
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_leads();

-- Função para estatísticas (quando necessário)
CREATE OR REPLACE FUNCTION public.get_leads_stats()
RETURNS TABLE (
  total_leads BIGINT,
  leads_hoje BIGINT,
  leads_semana BIGINT,
  leads_mes BIGINT,
  por_tipo JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_leads,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as leads_hoje,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as leads_semana,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as leads_mes,
    jsonb_object_agg(tipo_estabelecimento, count) as por_tipo
  FROM (
    SELECT 
      tipo_estabelecimento,
      COUNT(*) as count
    FROM public.leads_nivela 
    GROUP BY tipo_estabelecimento
  ) stats,
  public.leads_nivela;
END;
$$;