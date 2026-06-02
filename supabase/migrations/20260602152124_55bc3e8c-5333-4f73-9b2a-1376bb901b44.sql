DO $$
DECLARE
  v_user uuid := '8ba61dab-ff7a-49d0-88ea-b7795e565914';
  v_barb uuid := '4e6066be-595d-4f22-8d0f-3e8ff61d53c9';
BEGIN
  DELETE FROM public.pagamentos_assinatura WHERE assinatura_id IN (
    SELECT ac.id FROM public.assinaturas_cliente ac
    JOIN public.planos_cliente pc ON pc.id = ac.plano_id
    WHERE pc.barbearia_id = v_barb
  );
  DELETE FROM public.assinaturas_cliente WHERE plano_id IN (SELECT id FROM public.planos_cliente WHERE barbearia_id = v_barb);
  DELETE FROM public.barbearia_mp_credentials WHERE barbearia_id = v_barb;
  DELETE FROM public.faturas WHERE assinatura_id IN (SELECT id FROM public.assinaturas WHERE barbearia_id = v_barb);
  DELETE FROM public.assinaturas WHERE barbearia_id = v_barb;
  DELETE FROM public.convites WHERE barbearia_id = v_barb;
  DELETE FROM public.notificacoes WHERE barbearia_id = v_barb;
  DELETE FROM public.promocoes WHERE barbearia_id = v_barb;
  DELETE FROM public.produtos WHERE barbearia_id = v_barb;
  DELETE FROM public.planos_cliente WHERE barbearia_id = v_barb;
  DELETE FROM public.donos_barbearia WHERE barbearia_id = v_barb;
  DELETE FROM public.user_roles WHERE user_id = v_user AND role = 'owner'::app_role AND barbearia_id = v_barb;
  DELETE FROM public.barbearias WHERE id = v_barb;
END $$;