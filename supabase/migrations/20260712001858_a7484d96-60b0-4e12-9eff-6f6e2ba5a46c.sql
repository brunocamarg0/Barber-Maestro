
-- 1. agendamentos: add WITH CHECK
DROP POLICY IF EXISTS "Dono atualiza agendamentos da sua barbearia" ON public.agendamentos;
CREATE POLICY "Dono atualiza agendamentos da sua barbearia"
ON public.agendamentos
FOR UPDATE
USING ((barbearia_id = get_user_barbearia_id(auth.uid())) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK ((barbearia_id = get_user_barbearia_id(auth.uid())) OR has_role(auth.uid(), 'super_admin'::app_role));

-- 2. barbearias: trigger to block owner changing plano/status/data_vencimento
CREATE OR REPLACE FUNCTION public.protect_barbearia_billing_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.plano IS DISTINCT FROM OLD.plano
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.data_vencimento IS DISTINCT FROM OLD.data_vencimento
  THEN
    RAISE EXCEPTION 'Somente super_admin ou serviço pode alterar plano, status ou data_vencimento';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_barbearia_billing_fields_trg ON public.barbearias;
CREATE TRIGGER protect_barbearia_billing_fields_trg
BEFORE UPDATE ON public.barbearias
FOR EACH ROW EXECUTE FUNCTION public.protect_barbearia_billing_fields();

-- 3. clientes: trigger to block vip / email_verificado self-update
CREATE OR REPLACE FUNCTION public.protect_cliente_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  -- Owner/professional managing their customer: allow
  IF public.is_cliente_da_minha_barbearia(OLD.id, auth.uid()) THEN
    RETURN NEW;
  END IF;
  -- Client self path
  IF OLD.user_id IS NOT NULL AND OLD.user_id = auth.uid() THEN
    IF NEW.vip IS DISTINCT FROM OLD.vip
       OR NEW.email_verificado IS DISTINCT FROM OLD.email_verificado
       OR NEW.user_id IS DISTINCT FROM OLD.user_id
    THEN
      RAISE EXCEPTION 'Cliente não pode alterar vip, email_verificado ou user_id';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_cliente_self_update_trg ON public.clientes;
CREATE TRIGGER protect_cliente_self_update_trg
BEFORE UPDATE ON public.clientes
FOR EACH ROW EXECUTE FUNCTION public.protect_cliente_self_update();

-- 4. pagamentos: add WITH CHECK + trigger blocking client from touching sensitive fields
DROP POLICY IF EXISTS "Cliente atualiza pagamento do seu agendamento" ON public.pagamentos;
CREATE POLICY "Cliente atualiza pagamento do seu agendamento"
ON public.pagamentos
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.agendamentos a
  JOIN public.clientes c ON c.id = a.cliente_id
  WHERE a.id = pagamentos.agendamento_id AND c.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.agendamentos a
  JOIN public.clientes c ON c.id = a.cliente_id
  WHERE a.id = pagamentos.agendamento_id AND c.user_id = auth.uid()
));

CREATE OR REPLACE FUNCTION public.protect_pagamento_cliente_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_client BOOLEAN;
  v_is_owner  BOOLEAN;
BEGIN
  IF public.has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.agendamentos a
    WHERE a.id = OLD.agendamento_id
      AND a.barbearia_id = public.get_user_barbearia_id(auth.uid())
  ) INTO v_is_owner;
  IF v_is_owner THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.agendamentos a
    JOIN public.clientes c ON c.id = a.cliente_id
    WHERE a.id = OLD.agendamento_id AND c.user_id = auth.uid()
  ) INTO v_is_client;

  IF v_is_client THEN
    IF NEW.status IS DISTINCT FROM OLD.status
       OR NEW.valor IS DISTINCT FROM OLD.valor
       OR NEW.agendamento_id IS DISTINCT FROM OLD.agendamento_id
       OR NEW.forma_pagamento IS DISTINCT FROM OLD.forma_pagamento
    THEN
      RAISE EXCEPTION 'Cliente não pode alterar status, valor, forma ou agendamento do pagamento';
    END IF;
    -- Block mercadopago_* columns dynamically (if present) via row-level compare:
    IF to_jsonb(NEW) - 'updated_at' IS DISTINCT FROM to_jsonb(NEW) THEN
      NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_pagamento_cliente_self_update_trg ON public.pagamentos;
CREATE TRIGGER protect_pagamento_cliente_self_update_trg
BEFORE UPDATE ON public.pagamentos
FOR EACH ROW EXECUTE FUNCTION public.protect_pagamento_cliente_self_update();
