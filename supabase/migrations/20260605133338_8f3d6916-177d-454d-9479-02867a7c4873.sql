
-- Fix 1: Restrict notificacoes INSERT to clients linked to the barbearia
DROP POLICY IF EXISTS "Cliente cria notificacao da barbearia" ON public.notificacoes;

CREATE POLICY "Cliente cria notificacao da barbearia"
ON public.notificacoes
FOR INSERT
TO authenticated
WITH CHECK (
  barbearia_id IS NOT NULL
  AND (
    -- User belongs to that barbearia (owner/professional)
    barbearia_id = public.get_user_barbearia_id(auth.uid())
    -- Or super admin
    OR public.has_role(auth.uid(), 'super_admin'::app_role)
    -- Or the client has an appointment with this barbearia
    OR EXISTS (
      SELECT 1
      FROM public.agendamentos a
      JOIN public.clientes c ON c.id = a.cliente_id
      WHERE c.user_id = auth.uid()
        AND a.barbearia_id = notificacoes.barbearia_id
    )
    -- Or the client is linked to a professional of this barbearia
    OR EXISTS (
      SELECT 1
      FROM public.cliente_profissional cp
      JOIN public.clientes c ON c.id = cp.cliente_id
      JOIN public.profissionais p ON p.id = cp.profissional_id
      WHERE c.user_id = auth.uid()
        AND p.barbearia_id = notificacoes.barbearia_id
    )
  )
);

-- Fix 2: Add restrictive INSERT/UPDATE policy on user_roles preventing privilege escalation
CREATE POLICY "Bloquear self-insert em user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Bloquear self-update em user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));
