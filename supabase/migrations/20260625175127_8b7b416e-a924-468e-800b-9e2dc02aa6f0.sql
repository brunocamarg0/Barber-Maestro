DROP POLICY IF EXISTS "Planos cliente visíveis publicamente" ON public.planos_cliente;
CREATE POLICY "Planos cliente ativos visíveis publicamente"
ON public.planos_cliente
FOR SELECT
TO anon, authenticated
USING (ativo = true);

DROP POLICY IF EXISTS "Promoções visíveis publicamente" ON public.promocoes;
CREATE POLICY "Promoções ativas visíveis publicamente"
ON public.promocoes
FOR SELECT
TO anon, authenticated
USING (ativo = true);