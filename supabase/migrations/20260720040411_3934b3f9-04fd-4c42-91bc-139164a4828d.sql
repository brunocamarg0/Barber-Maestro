
-- Novos campos
ALTER TABLE public.agendamentos
  ADD COLUMN IF NOT EXISTS confirmacao_enviada boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lembrete_enviado boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS avaliacao_enviada boolean NOT NULL DEFAULT false;

-- Função que dispara a Edge Function de confirmação por WhatsApp
CREATE OR REPLACE FUNCTION public.trigger_whatsapp_confirmacao(_agendamento_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://oyfgyoutpwmoqdtubveb.supabase.co/functions/v1/enviar-confirmacao',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
      )
    ),
    body := jsonb_build_object('agendamento_id', _agendamento_id)
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'trigger_whatsapp_confirmacao failed: %', SQLERRM;
END;
$$;

-- Trigger que dispara quando o status muda para confirmado
CREATE OR REPLACE FUNCTION public.on_agendamento_confirmado_whatsapp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'confirmado'
     AND (OLD.status IS DISTINCT FROM 'confirmado')
     AND NEW.confirmacao_enviada = false
  THEN
    PERFORM public.trigger_whatsapp_confirmacao(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_agendamento_confirmado_whatsapp ON public.agendamentos;
CREATE TRIGGER trg_agendamento_confirmado_whatsapp
  AFTER UPDATE OF status ON public.agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.on_agendamento_confirmado_whatsapp();

-- Também dispara em INSERT quando já vem confirmado (modo automático)
CREATE OR REPLACE FUNCTION public.on_agendamento_inserted_confirmado_whatsapp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'confirmado' AND NEW.confirmacao_enviada = false THEN
    PERFORM public.trigger_whatsapp_confirmacao(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_agendamento_insert_confirmado_whatsapp ON public.agendamentos;
CREATE TRIGGER trg_agendamento_insert_confirmado_whatsapp
  AFTER INSERT ON public.agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.on_agendamento_inserted_confirmado_whatsapp();
