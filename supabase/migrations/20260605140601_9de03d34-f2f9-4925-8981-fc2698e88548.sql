
-- 1) Agendamentos: enforce cliente binding on INSERT
DROP POLICY IF EXISTS "Usuário autenticado cria agendamento" ON public.agendamentos;
CREATE POLICY "Usuário autenticado cria agendamento"
ON public.agendamentos
FOR INSERT
TO authenticated
WITH CHECK (
  public.validar_agendamento_input(barbearia_id, servico_id)
  AND (
    -- cliente criando para si mesmo
    (cliente_id IS NOT NULL AND cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()))
    -- dono/profissional da barbearia ou super_admin podem criar para qualquer cliente (inclusive walk-in com cliente_id null)
    OR barbearia_id = public.get_user_barbearia_id(auth.uid())
    OR public.has_role(auth.uid(), 'super_admin'::app_role)
  )
);

-- 2) Avaliações: bloquear alteração de campos do cliente por donos via trigger
CREATE OR REPLACE FUNCTION public.protect_avaliacao_client_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- super_admin e o próprio cliente podem alterar tudo
  IF public.has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.clientes c
    WHERE c.id = OLD.cliente_id AND c.user_id = auth.uid()
  ) THEN
    RETURN NEW;
  END IF;

  -- Demais usuários (donos/profissionais): só podem alterar resposta/respondido_em
  IF NEW.cliente_id IS DISTINCT FROM OLD.cliente_id
     OR NEW.agendamento_id IS DISTINCT FROM OLD.agendamento_id
     OR NEW.nota_profissional IS DISTINCT FROM OLD.nota_profissional
     OR NEW.nota_atendimento IS DISTINCT FROM OLD.nota_atendimento
     OR NEW.nota_ambiente IS DISTINCT FROM OLD.nota_ambiente
     OR NEW.comentario IS DISTINCT FROM OLD.comentario
  THEN
    RAISE EXCEPTION 'Apenas resposta e respondido_em podem ser modificados por donos da barbearia';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_avaliacao_client_fields ON public.avaliacoes;
CREATE TRIGGER trg_protect_avaliacao_client_fields
BEFORE UPDATE ON public.avaliacoes
FOR EACH ROW EXECUTE FUNCTION public.protect_avaliacao_client_fields();

-- 3) Notificações: restringir INSERT por cliente — somente para o próprio cliente, sem barbearia_id
DROP POLICY IF EXISTS "Cliente cria notificacao da barbearia" ON public.notificacoes;

CREATE POLICY "Cliente cria notificacao propria"
ON public.notificacoes
FOR INSERT
TO authenticated
WITH CHECK (
  barbearia_id IS NULL
  AND cliente_id IS NOT NULL
  AND cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
);

CREATE POLICY "Dono cria notificacao da barbearia"
ON public.notificacoes
FOR INSERT
TO authenticated
WITH CHECK (
  barbearia_id IS NOT NULL
  AND (
    barbearia_id = public.get_user_barbearia_id(auth.uid())
    OR public.has_role(auth.uid(), 'super_admin'::app_role)
  )
);
