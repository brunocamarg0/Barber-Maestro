CREATE POLICY "Cliente cancela sua propria assinatura"
ON public.assinaturas_cliente
FOR UPDATE
TO authenticated
USING (
  cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
)
WITH CHECK (
  cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
);