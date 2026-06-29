-- A política ALL antiga liberava SELECT para qualquer usuário da mesma barbearia,
-- expondo comissões entre colegas. Vamos separar: SELECT continua restrito pela
-- política existente "Dono e próprio profissional veem dados sensíveis"; demais
-- operações ficam restritas a donos/super-admin via políticas dedicadas.

DROP POLICY IF EXISTS "Dono gerencia profissionais da sua barbearia" ON public.profissionais;

CREATE POLICY "Dono insere profissionais da sua barbearia"
  ON public.profissionais
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (barbearia_id = public.get_user_barbearia_id(auth.uid()) AND public.has_role(auth.uid(), 'owner'::app_role))
    OR public.has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE POLICY "Dono atualiza profissionais da sua barbearia"
  ON public.profissionais
  FOR UPDATE
  TO authenticated
  USING (
    (barbearia_id = public.get_user_barbearia_id(auth.uid()) AND public.has_role(auth.uid(), 'owner'::app_role))
    OR public.has_role(auth.uid(), 'super_admin'::app_role)
  )
  WITH CHECK (
    (barbearia_id = public.get_user_barbearia_id(auth.uid()) AND public.has_role(auth.uid(), 'owner'::app_role))
    OR public.has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE POLICY "Dono remove profissionais da sua barbearia"
  ON public.profissionais
  FOR DELETE
  TO authenticated
  USING (
    (barbearia_id = public.get_user_barbearia_id(auth.uid()) AND public.has_role(auth.uid(), 'owner'::app_role))
    OR public.has_role(auth.uid(), 'super_admin'::app_role)
  );