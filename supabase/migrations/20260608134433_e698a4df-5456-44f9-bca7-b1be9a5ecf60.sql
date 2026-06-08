
-- Fix 1: Restrict barbearias SELECT to owners and super_admin only (exclude professionals from seeing cnpj_cpf etc)
DROP POLICY IF EXISTS "Dono vê dados sensíveis da própria barbearia" ON public.barbearias;
CREATE POLICY "Dono vê dados sensíveis da própria barbearia"
ON public.barbearias FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (
    id = get_user_barbearia_id(auth.uid())
    AND has_role(auth.uid(), 'owner'::app_role)
  )
);

-- Fix 2: Limit convites SELECT to non-used, non-expired tokens
DROP POLICY IF EXISTS "Owner reads convites of their barbearia" ON public.convites;
CREATE POLICY "Owner reads convites of their barbearia"
ON public.convites FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'owner'::app_role
        AND ur.barbearia_id = convites.barbearia_id
    )
    AND COALESCE(usado, false) = false
    AND (expira_em IS NULL OR expira_em > now())
  )
);
