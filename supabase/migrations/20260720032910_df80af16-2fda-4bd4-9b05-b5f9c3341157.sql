DROP POLICY IF EXISTS "Planos visíveis para todos" ON public.planos;
CREATE POLICY "Planos ativos visíveis para todos" ON public.planos FOR SELECT USING (ativo = true);