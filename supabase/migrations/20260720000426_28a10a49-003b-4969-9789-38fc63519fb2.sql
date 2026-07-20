CREATE POLICY "Dono notifica cliente da barbearia"
ON public.notificacoes
FOR INSERT
TO authenticated
WITH CHECK (
  cliente_id IS NOT NULL
  AND public.is_cliente_da_minha_barbearia(cliente_id, auth.uid())
);