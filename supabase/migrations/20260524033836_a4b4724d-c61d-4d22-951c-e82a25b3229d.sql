CREATE OR REPLACE FUNCTION public.get_horarios_ocupados(_barbearia_id uuid, _data date)
RETURNS TABLE(horario text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.horario
  FROM public.agendamentos a
  WHERE a.barbearia_id = _barbearia_id
    AND a.data >= (_data::text || ' 00:00:00')::timestamptz
    AND a.data <  ((_data + 1)::text || ' 00:00:00')::timestamptz
    AND a.status <> 'cancelado'
    AND a.horario IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.get_horarios_ocupados(uuid, date) FROM public;
GRANT EXECUTE ON FUNCTION public.get_horarios_ocupados(uuid, date) TO anon, authenticated;