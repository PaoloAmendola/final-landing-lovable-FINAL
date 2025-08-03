-- Criar tabela de leads para o formulário
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  empresa TEXT,
  cargo TEXT,
  mensagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de leads (público pode enviar formulário)
CREATE POLICY "Qualquer pessoa pode inserir leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Política para visualizar leads (apenas admins autenticados - para futuro)
CREATE POLICY "Admins podem visualizar leads" 
ON public.leads 
FOR SELECT 
USING (false); -- Por enquanto bloqueado, será alterado quando implementarmos auth

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para melhor performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_empresa ON public.leads(empresa);

-- Criar tabela para métricas de performance
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  user_agent TEXT,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de métricas
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Política para inserção de métricas (público pode enviar)
CREATE POLICY "Qualquer pessoa pode inserir métricas" 
ON public.performance_metrics 
FOR INSERT 
WITH CHECK (true);

-- Criar tabela para eventos de analytics
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB,
  user_id UUID,
  session_id TEXT,
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de analytics
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Política para inserção de eventos (público pode enviar)
CREATE POLICY "Qualquer pessoa pode inserir eventos de analytics" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);