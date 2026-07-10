
-- 1) Anon (guest) booking on agendamentos
GRANT INSERT ON public.agendamentos TO anon;

CREATE POLICY "Visitante cria agendamento sem conta"
ON public.agendamentos
FOR INSERT
TO anon
WITH CHECK (
  cliente_id IS NULL
  AND cliente_nome IS NOT NULL AND length(btrim(cliente_nome)) >= 2
  AND telefone IS NOT NULL AND length(btrim(telefone)) >= 8
  AND public.validar_agendamento_input(barbearia_id, servico_id)
);

-- 2) Auto-assign top plan to Bruno Camargo (existing barbearia)
DO $$
DECLARE
  v_barbearia_id UUID;
  v_plano_id UUID;
BEGIN
  SELECT id INTO v_barbearia_id
  FROM public.barbearias
  WHERE nome ILIKE 'Barbearia Bruno Camargo%'
  ORDER BY created_at ASC
  LIMIT 1;

  SELECT id INTO v_plano_id
  FROM public.planos
  WHERE ativo = true AND valor_mensal > 0
  ORDER BY valor_mensal DESC
  LIMIT 1;

  IF v_barbearia_id IS NOT NULL AND v_plano_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM public.assinaturas WHERE barbearia_id = v_barbearia_id) THEN
    INSERT INTO public.assinaturas (
      barbearia_id, plano_id, status,
      data_inicio, data_vencimento, proximo_vencimento,
      pagamento_recorrente
    ) VALUES (
      v_barbearia_id, v_plano_id, 'ativa',
      now(), now() + interval '30 days', now() + interval '30 days',
      false
    );
    UPDATE public.barbearias SET status = 'ativa' WHERE id = v_barbearia_id;
  END IF;
END $$;

-- 3) Trigger: auto-assign top plan to future barbearia with email bernardostrabelli@gmail.com
CREATE OR REPLACE FUNCTION public.auto_assign_top_plan_for_special_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
      NEW.status := 'ativa';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_assign_top_plan_special ON public.barbearias;
CREATE TRIGGER trg_auto_assign_top_plan_special
AFTER INSERT ON public.barbearias
FOR EACH ROW EXECUTE FUNCTION public.auto_assign_top_plan_for_special_email();
