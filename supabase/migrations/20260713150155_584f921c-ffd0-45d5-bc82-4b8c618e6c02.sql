
-- Tighten client policies to prevent status/financial tampering

-- 1) assinaturas_cliente: client can only transition to 'cancelada'
DROP POLICY IF EXISTS "Cliente cancela sua propria assinatura" ON public.assinaturas_cliente;
CREATE POLICY "Cliente cancela sua propria assinatura"
ON public.assinaturas_cliente
FOR UPDATE
USING (
  cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
)
WITH CHECK (
  cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
  AND status = 'cancelada'
);

-- 2) pagamentos: remove client UPDATE policy entirely (only edge functions / owner update payments)
DROP POLICY IF EXISTS "Cliente atualiza pagamento do seu agendamento" ON public.pagamentos;

-- 3) pagamentos: client INSERT restricted to pendente status and no MP fields
DROP POLICY IF EXISTS "Cliente cria pagamento do seu agendamento" ON public.pagamentos;
CREATE POLICY "Cliente cria pagamento do seu agendamento"
ON public.pagamentos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.agendamentos a
    JOIN public.clientes c ON c.id = a.cliente_id
    WHERE a.id = pagamentos.agendamento_id AND c.user_id = auth.uid()
  )
  AND coalesce(status, 'pendente') = 'pendente'
  AND mercadopago_payment_id IS NULL
  AND mercadopago_status IS NULL
);
