
-- 1. avaliacoes: add WITH CHECK so owners can only modify resposta / respondido_em
DROP POLICY IF EXISTS "Dono responde avaliações da sua barbearia" ON public.avaliacoes;
CREATE POLICY "Dono responde avaliações da sua barbearia"
ON public.avaliacoes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.agendamentos a
    WHERE a.id = avaliacoes.agendamento_id
      AND a.barbearia_id = public.get_user_barbearia_id(auth.uid())
  )
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.agendamentos a
    WHERE a.id = avaliacoes.agendamento_id
      AND a.barbearia_id = public.get_user_barbearia_id(auth.uid())
  )
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
);
-- The existing protect_avaliacao_client_fields trigger enforces column-level
-- restrictions (only resposta and respondido_em may change for non-owner/non-client users).

-- 2. agendamentos: restrict walk-in (NULL cliente_id) inserts to owners / super_admins
DROP POLICY IF EXISTS "Usuário autenticado cria agendamento" ON public.agendamentos;
CREATE POLICY "Usuário autenticado cria agendamento"
ON public.agendamentos
FOR INSERT
TO authenticated
WITH CHECK (
  (
    cliente_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = agendamentos.cliente_id
        AND c.user_id = auth.uid()
    )
  )
  OR (
    cliente_id IS NULL
    AND barbearia_id = public.get_user_barbearia_id(auth.uid())
    AND (
      public.has_role(auth.uid(), 'owner'::app_role)
      OR public.has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
);

-- 3. profissionais: prevent self-update of barbearia_id, comissao_*, ativo
DROP POLICY IF EXISTS "Profissional atualiza seu próprio cadastro" ON public.profissionais;
CREATE POLICY "Profissional atualiza seu próprio cadastro"
ON public.profissionais
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.protect_profissional_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- super_admin and owner of the barbearia may change anything
  IF public.has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF public.has_role(auth.uid(), 'owner'::app_role)
     AND OLD.barbearia_id = public.get_user_barbearia_id(auth.uid())
  THEN
    RETURN NEW;
  END IF;

  -- self update path: lock down sensitive columns
  IF OLD.user_id IS NOT NULL AND OLD.user_id = auth.uid() THEN
    IF NEW.barbearia_id IS DISTINCT FROM OLD.barbearia_id
       OR NEW.comissao_tipo IS DISTINCT FROM OLD.comissao_tipo
       OR NEW.comissao_valor IS DISTINCT FROM OLD.comissao_valor
       OR NEW.comissao_assinatura IS DISTINCT FROM OLD.comissao_assinatura
       OR NEW.ativo IS DISTINCT FROM OLD.ativo
       OR NEW.user_id IS DISTINCT FROM OLD.user_id
    THEN
      RAISE EXCEPTION 'Profissional não pode modificar barbearia_id, comissões, ativo ou user_id';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profissional_self_update_trg ON public.profissionais;
CREATE TRIGGER protect_profissional_self_update_trg
BEFORE UPDATE ON public.profissionais
FOR EACH ROW EXECUTE FUNCTION public.protect_profissional_self_update();
