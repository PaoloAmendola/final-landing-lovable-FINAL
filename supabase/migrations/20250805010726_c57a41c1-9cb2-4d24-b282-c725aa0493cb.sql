-- Correção dos problemas de segurança detectados pelo linter

-- 1. Corrigir a função update_updated_at_leads com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_leads()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = '';

-- 2. Corrigir a função get_leads_stats com search_path seguro
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
SET search_path = ''
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