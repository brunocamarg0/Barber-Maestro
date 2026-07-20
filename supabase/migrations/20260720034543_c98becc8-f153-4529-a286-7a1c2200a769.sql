
-- 1) Colunas de controle de lembretes
ALTER TABLE public.agendamentos
  ADD COLUMN IF NOT EXISTS lembrete_24h_enviado boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lembrete_2h_enviado  boolean NOT NULL DEFAULT false;

-- 2) Função utilitária: dispara a edge function agendamento-emails
CREATE OR REPLACE FUNCTION public.trigger_agendamento_email(_action text, _agendamento_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://oyfgyoutpwmoqdtubveb.supabase.co/functions/v1/agendamento-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
      )
    ),
    body := jsonb_build_object('action', _action, 'agendamento_id', _agendamento_id)
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'trigger_agendamento_email failed: %', SQLERRM;
END;
$$;

-- 3) Trigger AFTER INSERT em agendamentos → e-mail "criado"
CREATE OR REPLACE FUNCTION public.on_agendamento_inserted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM public.trigger_agendamento_email('criado', NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_agendamento_email_criado ON public.agendamentos;
CREATE TRIGGER trg_agendamento_email_criado
AFTER INSERT ON public.agendamentos
FOR EACH ROW EXECUTE FUNCTION public.on_agendamento_inserted();

-- 4) Trigger AFTER UPDATE quando muda para confirmado
CREATE OR REPLACE FUNCTION public.on_agendamento_confirmado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'confirmado' AND (OLD.status IS DISTINCT FROM 'confirmado') THEN
    PERFORM public.trigger_agendamento_email('confirmado', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_agendamento_email_confirmado ON public.agendamentos;
CREATE TRIGGER trg_agendamento_email_confirmado
AFTER UPDATE OF status ON public.agendamentos
FOR EACH ROW EXECUTE FUNCTION public.on_agendamento_confirmado();

-- 5) Cron a cada 30 min para enviar lembretes
DO $$
BEGIN
  PERFORM cron.unschedule('agendamento-lembretes');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'agendamento-lembretes',
  '*/30 * * * *',
  $cron$
    SELECT net.http_post(
      url := 'https://oyfgyoutpwmoqdtubveb.supabase.co/functions/v1/agendamento-emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
        )
      ),
      body := jsonb_build_object('action', 'lembretes')
    );
  $cron$
);
