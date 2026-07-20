
-- 1) Colunas de trial/dunning
ALTER TABLE public.assinaturas
  ADD COLUMN IF NOT EXISTS trial_ate TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tentativas_cobranca INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ultima_tentativa TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS bloqueada_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS motivo_bloqueio TEXT;

-- 2) Trigger: ao criar barbearia, cria assinatura em modo teste (7 dias)
CREATE OR REPLACE FUNCTION public.create_trial_assinatura()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plano_id UUID;
BEGIN
  -- Já existe assinatura? Nada a fazer (ex.: trigger do bernardostrabelli)
  IF EXISTS (SELECT 1 FROM public.assinaturas WHERE barbearia_id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Escolhe o plano básico ativo (menor valor > 0)
  SELECT id INTO v_plano_id
  FROM public.planos
  WHERE ativo = true AND valor_mensal > 0
  ORDER BY valor_mensal ASC
  LIMIT 1;

  IF v_plano_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.assinaturas (
    barbearia_id, plano_id, status,
    data_inicio, data_vencimento, proximo_vencimento,
    pagamento_recorrente, trial_ate
  ) VALUES (
    NEW.id, v_plano_id, 'em_teste',
    now(), now() + interval '7 days', now() + interval '7 days',
    false, now() + interval '7 days'
  );

  -- Barbearia entra como em_teste também
  NEW.status := COALESCE(NEW.status, 'em_teste');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_trial_assinatura ON public.barbearias;
CREATE TRIGGER trg_create_trial_assinatura
BEFORE INSERT ON public.barbearias
FOR EACH ROW EXECUTE FUNCTION public.create_trial_assinatura();

-- 3) Função de status para o painel do dono
CREATE OR REPLACE FUNCTION public.assinatura_status_dono(_user_id uuid)
RETURNS TABLE (
  barbearia_id uuid,
  status text,
  trial_ate timestamptz,
  proximo_vencimento timestamptz,
  bloqueada boolean,
  dias_trial_restantes integer,
  dias_atraso integer
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    a.barbearia_id,
    a.status,
    a.trial_ate,
    a.proximo_vencimento,
    (a.bloqueada_em IS NOT NULL OR a.status = 'suspensa'),
    CASE WHEN a.trial_ate IS NOT NULL
      THEN GREATEST(0, EXTRACT(DAY FROM (a.trial_ate - now()))::int)
      ELSE NULL END,
    CASE WHEN a.proximo_vencimento < now()
      THEN EXTRACT(DAY FROM (now() - a.proximo_vencimento))::int
      ELSE 0 END
  FROM public.assinaturas a
  WHERE a.barbearia_id = public.get_user_barbearia_id(_user_id)
  ORDER BY a.created_at DESC
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.assinatura_status_dono(uuid) TO authenticated;
