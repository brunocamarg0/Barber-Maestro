
-- Move trial + special-plan assinatura creation to AFTER INSERT so the FK to barbearias exists.
-- Use a BEFORE INSERT trigger only to seed default status.

DROP TRIGGER IF EXISTS trg_create_trial_assinatura ON public.barbearias;
DROP TRIGGER IF EXISTS trg_auto_assign_top_plan_special ON public.barbearias;

CREATE OR REPLACE FUNCTION public.set_barbearia_default_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status IS NULL THEN
    NEW.status := 'em_teste';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_barbearia_default_status
BEFORE INSERT ON public.barbearias
FOR EACH ROW EXECUTE FUNCTION public.set_barbearia_default_status();

CREATE OR REPLACE FUNCTION public.create_trial_assinatura()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_plano_id UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM public.assinaturas WHERE barbearia_id = NEW.id) THEN
    RETURN NEW;
  END IF;

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

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_assign_top_plan_for_special_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_plano_id UUID;
BEGIN
  IF lower(coalesce(NEW.email, '')) = 'bernardostrabelli@gmail.com' THEN
    SELECT id INTO v_plano_id
    FROM public.planos
    WHERE ativo = true AND valor_mensal > 0
    ORDER BY valor_mensal DESC
    LIMIT 1;

    IF v_plano_id IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM public.assinaturas WHERE barbearia_id = NEW.id) THEN
      INSERT INTO public.assinaturas (
        barbearia_id, plano_id, status,
        data_inicio, data_vencimento, proximo_vencimento,
        pagamento_recorrente
      ) VALUES (
        NEW.id, v_plano_id, 'ativa',
        now(), now() + interval '30 days', now() + interval '30 days',
        false
      );
      UPDATE public.barbearias SET status = 'ativa' WHERE id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Order matters: special plan first (skips trial insert), then trial fallback.
CREATE TRIGGER trg_auto_assign_top_plan_special
AFTER INSERT ON public.barbearias
FOR EACH ROW EXECUTE FUNCTION public.auto_assign_top_plan_for_special_email();

CREATE TRIGGER trg_create_trial_assinatura
AFTER INSERT ON public.barbearias
FOR EACH ROW EXECUTE FUNCTION public.create_trial_assinatura();
