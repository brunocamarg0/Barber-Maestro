
-- Allow NULL (= unlimited) for plan limits
ALTER TABLE public.planos ALTER COLUMN limite_barbeiros DROP NOT NULL;
ALTER TABLE public.planos ALTER COLUMN limite_agendamentos DROP NOT NULL;

ALTER TABLE public.planos ADD COLUMN IF NOT EXISTS slug text UNIQUE;

INSERT INTO public.planos (slug, nome, descricao, valor_mensal, limite_barbeiros, limite_agendamentos, recursos, ativo)
VALUES
  ('basico', 'Básico', 'Ideal para barbeiro autônomo começando', 49.90, 1, 100,
    ARRAY['agenda','clientes','servicos','link_publico','relatorios_basicos','pagamento_manual'],
    true),
  ('premium', 'Profissional', 'Para barbearias em crescimento', 99.90, 5, 1000,
    ARRAY['agenda','clientes','servicos','link_publico','relatorios_basicos','pagamento_manual',
          'multi_profissionais','comissoes','mercadopago_connect','whatsapp','promocoes',
          'fidelidade','avaliacoes','estoque','relatorios_avancados','planos_cliente'],
    true),
  ('enterprise', 'Enterprise', 'Para redes e múltiplas unidades', 199.90, NULL, NULL,
    ARRAY['agenda','clientes','servicos','link_publico','relatorios_basicos','pagamento_manual',
          'multi_profissionais','comissoes','mercadopago_connect','whatsapp','promocoes',
          'fidelidade','avaliacoes','estoque','relatorios_avancados','planos_cliente',
          'multi_unidade','relatorios_consolidados','api_integracoes','suporte_prioritario',
          'marca_branca','exportacao_avancada'],
    true)
ON CONFLICT (slug) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  valor_mensal = EXCLUDED.valor_mensal,
  limite_barbeiros = EXCLUDED.limite_barbeiros,
  limite_agendamentos = EXCLUDED.limite_agendamentos,
  recursos = EXCLUDED.recursos,
  ativo = EXCLUDED.ativo,
  updated_at = now();

CREATE OR REPLACE FUNCTION public.has_feature(_barbearia_id uuid, _feature_id text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.assinaturas a
    JOIN public.planos p ON p.id = a.plano_id
    WHERE a.barbearia_id = _barbearia_id
      AND a.status IN ('ativa','em_dia','em_teste')
      AND p.ativo = true
      AND _feature_id = ANY(p.recursos)
  );
$$;

CREATE OR REPLACE FUNCTION public.get_plano_ativo(_barbearia_id uuid)
RETURNS TABLE(plano_id uuid, slug text, nome text, valor_mensal numeric,
              limite_barbeiros integer, limite_agendamentos integer,
              recursos text[], status text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, p.slug, p.nome, p.valor_mensal, p.limite_barbeiros,
         p.limite_agendamentos, p.recursos, a.status
  FROM public.assinaturas a
  JOIN public.planos p ON p.id = a.plano_id
  WHERE a.barbearia_id = _barbearia_id
  ORDER BY a.created_at DESC
  LIMIT 1;
$$;
