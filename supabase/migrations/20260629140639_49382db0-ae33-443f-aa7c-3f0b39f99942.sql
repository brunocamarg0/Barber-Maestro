
DROP POLICY IF EXISTS "Serviços visíveis publicamente" ON public.servicos;
CREATE POLICY "Serviços visíveis publicamente"
ON public.servicos FOR SELECT
USING (ativo = true);

DROP POLICY IF EXISTS "Promoções ativas visíveis publicamente" ON public.promocoes;
CREATE POLICY "Promoções ativas visíveis publicamente"
ON public.promocoes FOR SELECT
USING (
  ativo = true
  AND (valido_de IS NULL OR valido_de <= now())
  AND (valido_ate IS NULL OR valido_ate >= now())
);
