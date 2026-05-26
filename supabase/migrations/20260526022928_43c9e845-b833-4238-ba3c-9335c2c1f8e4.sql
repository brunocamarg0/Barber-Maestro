DROP POLICY IF EXISTS "Dono lê convites da sua barbearia" ON public.convites;

CREATE POLICY "Owner reads convites of their barbearia"
ON public.convites
FOR SELECT
TO authenticated
USING (
  (barbearia_id = public.get_user_barbearia_id(auth.uid())
    AND public.has_role(auth.uid(), 'owner'::app_role))
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
);