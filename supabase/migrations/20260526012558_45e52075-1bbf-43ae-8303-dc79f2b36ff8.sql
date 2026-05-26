ALTER TABLE public.barbearias
ADD COLUMN IF NOT EXISTS horario_funcionamento JSONB NOT NULL DEFAULT jsonb_build_object(
  'segunda', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
  'terca', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
  'quarta', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
  'quinta', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
  'sexta', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
  'sabado', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '17:00'),
  'domingo', jsonb_build_object('aberto', false, 'inicio', '09:00', 'fim', '13:00')
),
ADD COLUMN IF NOT EXISTS politica_cancelamento JSONB NOT NULL DEFAULT jsonb_build_object(
  'prazoMinimo', 2,
  'multa', 0,
  'permitirReagendamento', true
);

UPDATE public.barbearias
SET horario_funcionamento = COALESCE(horario_funcionamento, jsonb_build_object(
      'segunda', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
      'terca', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
      'quarta', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
      'quinta', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
      'sexta', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '19:00'),
      'sabado', jsonb_build_object('aberto', true, 'inicio', '09:00', 'fim', '17:00'),
      'domingo', jsonb_build_object('aberto', false, 'inicio', '09:00', 'fim', '13:00')
    )),
    politica_cancelamento = COALESCE(politica_cancelamento, jsonb_build_object(
      'prazoMinimo', 2,
      'multa', 0,
      'permitirReagendamento', true
    ))
WHERE horario_funcionamento IS NULL OR politica_cancelamento IS NULL;