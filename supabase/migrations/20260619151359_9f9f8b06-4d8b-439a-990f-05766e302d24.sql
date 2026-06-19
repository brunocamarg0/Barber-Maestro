DROP POLICY IF EXISTS "Dono atualiza sua própria barbearia" ON public.barbearias;
CREATE POLICY "Dono atualiza sua própria barbearia"
ON public.barbearias
FOR UPDATE
TO authenticated
USING (
  (id = public.get_user_barbearia_id(auth.uid()) AND public.has_role(auth.uid(), 'owner'::app_role))
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
)
WITH CHECK (
  (id = public.get_user_barbearia_id(auth.uid()) AND public.has_role(auth.uid(), 'owner'::app_role))
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
);