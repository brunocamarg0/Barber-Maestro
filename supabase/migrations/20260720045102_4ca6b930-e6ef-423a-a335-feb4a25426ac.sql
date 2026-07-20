DROP POLICY IF EXISTS "Profissional atualiza seu próprio cadastro" ON public.profissionais;

CREATE POLICY "Profissional atualiza seu próprio cadastro"
ON public.profissionais
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND barbearia_id IS NOT DISTINCT FROM (SELECT p.barbearia_id FROM public.profissionais p WHERE p.id = profissionais.id)
  AND comissao_tipo IS NOT DISTINCT FROM (SELECT p.comissao_tipo FROM public.profissionais p WHERE p.id = profissionais.id)
  AND comissao_valor IS NOT DISTINCT FROM (SELECT p.comissao_valor FROM public.profissionais p WHERE p.id = profissionais.id)
  AND comissao_assinatura IS NOT DISTINCT FROM (SELECT p.comissao_assinatura FROM public.profissionais p WHERE p.id = profissionais.id)
  AND ativo IS NOT DISTINCT FROM (SELECT p.ativo FROM public.profissionais p WHERE p.id = profissionais.id)
);