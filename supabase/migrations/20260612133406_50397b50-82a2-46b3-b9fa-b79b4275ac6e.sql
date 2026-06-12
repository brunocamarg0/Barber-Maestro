
-- Fix 1: Restrict client self-update on assinaturas_cliente to status='cancelada' only.
CREATE OR REPLACE FUNCTION public.protect_assinatura_cliente_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_owner_of_plan BOOLEAN;
BEGIN
  IF public.has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.planos_cliente pc
    WHERE pc.id = OLD.plano_id
      AND pc.barbearia_id = public.get_user_barbearia_id(auth.uid())
  ) INTO v_is_owner_of_plan;

  IF v_is_owner_of_plan THEN
    RETURN NEW;
  END IF;

  -- Path: client self-update — lock to cancellation only
  IF EXISTS (
    SELECT 1 FROM public.clientes c
    WHERE c.id = OLD.cliente_id AND c.user_id = auth.uid()
  ) THEN
    IF NEW.cliente_id IS DISTINCT FROM OLD.cliente_id
       OR NEW.plano_id IS DISTINCT FROM OLD.plano_id
       OR NEW.profissional_id IS DISTINCT FROM OLD.profissional_id
       OR NEW.data_inicio IS DISTINCT FROM OLD.data_inicio
       OR NEW.data_vencimento IS DISTINCT FROM OLD.data_vencimento
       OR NEW.valor IS DISTINCT FROM OLD.valor
       OR NEW.pagamento_recorrente IS DISTINCT FROM OLD.pagamento_recorrente
    THEN
      RAISE EXCEPTION 'Cliente só pode cancelar a própria assinatura';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelada' THEN
      RAISE EXCEPTION 'Cliente só pode alterar status para cancelada';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_assinatura_cliente_self_update ON public.assinaturas_cliente;
CREATE TRIGGER trg_protect_assinatura_cliente_self_update
BEFORE UPDATE ON public.assinaturas_cliente
FOR EACH ROW EXECUTE FUNCTION public.protect_assinatura_cliente_self_update();

-- Fix 3: Hide commission fields from colleague professionals.
-- Tighten SELECT policy so only self / owner / super_admin can read profissionais rows directly.
-- Colleague listings must use get_profissionais_publicos_by_barbearia (non-sensitive columns only).
DROP POLICY IF EXISTS "Dono e próprio profissional veem dados sensíveis" ON public.profissionais;
CREATE POLICY "Dono e próprio profissional veem dados sensíveis"
ON public.profissionais
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'super_admin'::app_role)
  OR (
    has_role(auth.uid(), 'owner'::app_role)
    AND barbearia_id = get_user_barbearia_id(auth.uid())
  )
);
