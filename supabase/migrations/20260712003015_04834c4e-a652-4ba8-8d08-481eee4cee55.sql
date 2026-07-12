
CREATE OR REPLACE FUNCTION public.criar_agendamento_publico(
  _barbearia_id uuid,
  _servico_id uuid,
  _profissional_id uuid,
  _cliente_nome text,
  _telefone text,
  _data timestamptz,
  _horario text,
  _observacao text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_nome text := btrim(coalesce(_cliente_nome, ''));
  v_tel  text := btrim(coalesce(_telefone, ''));
BEGIN
  IF length(v_nome) < 2 OR length(regexp_replace(v_tel, '\D', '', 'g')) < 8 THEN
    RAISE EXCEPTION 'Nome ou telefone inválido';
  END IF;
  IF NOT public.validar_agendamento_input(_barbearia_id, _servico_id) THEN
    RAISE EXCEPTION 'Serviço/barbearia inválidos';
  END IF;

  INSERT INTO public.agendamentos (
    barbearia_id, servico_id, cliente_id, cliente_nome, telefone,
    data, horario, status, observacao, confirmado_automaticamente
  ) VALUES (
    _barbearia_id, _servico_id, NULL, v_nome, v_tel,
    _data, _horario, 'pendente', NULLIF(btrim(coalesce(_observacao,'')), ''), false
  ) RETURNING id INTO v_id;

  IF _profissional_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.profissionais p
      WHERE p.id = _profissional_id AND p.barbearia_id = _barbearia_id
    ) THEN
      INSERT INTO public.agendamento_profissional (agendamento_id, profissional_id)
      VALUES (v_id, _profissional_id);
    END IF;
  END IF;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.criar_agendamento_publico(uuid, uuid, uuid, text, text, timestamptz, text, text) TO anon, authenticated;
