
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.unschedule('cobranca-recorrente-diaria') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'cobranca-recorrente-diaria'
);

SELECT cron.schedule(
  'cobranca-recorrente-diaria',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://oyfgyoutpwmoqdtubveb.supabase.co/functions/v1/cobranca-recorrente',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Zmd5b3V0cHdtb3FkdHVidmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1Njc2MzksImV4cCI6MjA5NTE0MzYzOX0.oGiWrG_0TNEl1hsBDxv7_hkcLUP0AgmCuKsHL5wyYIc'
    ),
    body := jsonb_build_object('trigger', 'cron', 'time', now())
  );
  $$
);
