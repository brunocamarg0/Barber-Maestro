-- Permitir que dono da barbearia gerencie pagamentos das assinaturas dos clientes dele
CREATE POLICY "Dono gerencia pagamentos assinatura cliente"
ON public.pagamentos_assinatura
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.assinaturas_cliente ac
    JOIN public.planos_cliente pc ON pc.id = ac.plano_id
    WHERE ac.id = pagamentos_assinatura.assinatura_id
      AND pc.barbearia_id = public.get_user_barbearia_id(auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.assinaturas_cliente ac
    JOIN public.planos_cliente pc ON pc.id = ac.plano_id
    WHERE ac.id = pagamentos_assinatura.assinatura_id
      AND pc.barbearia_id = public.get_user_barbearia_id(auth.uid())
  )
);