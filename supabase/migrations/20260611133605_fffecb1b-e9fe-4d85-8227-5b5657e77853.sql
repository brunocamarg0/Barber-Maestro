
-- Harden INSERT policy on agendamentos to explicitly require ownership when cliente_id IS NULL
DROP POLICY IF EXISTS "Usuário autenticado cria agendamento" ON public.agendamentos;

CREATE POLICY "Usuário autenticado cria agendamento"
ON public.agendamentos
FOR INSERT
TO authenticated
WITH CHECK (
  validar_agendamento_input(barbearia_id, servico_id)
  AND (
    -- Cliente criando para si mesmo (cliente_id obrigatório e ligado ao user)
    (
      cliente_id IS NOT NULL
      AND cliente_id IN (SELECT c.id FROM public.clientes c WHERE c.user_id = auth.uid())
    )
    -- Dono da barbearia (pode criar walk-in com cliente_id NULL)
    OR (
      barbearia_id IS NOT NULL
      AND barbearia_id = get_user_barbearia_id(auth.uid())
    )
    -- Super admin
    OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);
