
-- barbearias: ensure no anon access
DROP POLICY IF EXISTS "Super-admin gerencia barbearias" ON public.barbearias;
DROP POLICY IF EXISTS "Dono atualiza sua própria barbearia" ON public.barbearias;

CREATE POLICY "Super-admin gerencia barbearias"
ON public.barbearias
AS PERMISSIVE
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Dono atualiza sua própria barbearia"
ON public.barbearias
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (id = get_user_barbearia_id(auth.uid()));

-- produtos: ensure no anon access
DROP POLICY IF EXISTS "Dono gerencia produtos da sua barbearia" ON public.produtos;
DROP POLICY IF EXISTS "Dono vê produtos da sua barbearia" ON public.produtos;

CREATE POLICY "Dono gerencia produtos da sua barbearia"
ON public.produtos
AS PERMISSIVE
FOR ALL
TO authenticated
USING ((barbearia_id = get_user_barbearia_id(auth.uid())) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK ((barbearia_id = get_user_barbearia_id(auth.uid())) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Dono vê produtos da sua barbearia"
ON public.produtos
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ((barbearia_id = get_user_barbearia_id(auth.uid())) OR has_role(auth.uid(), 'super_admin'::app_role));
