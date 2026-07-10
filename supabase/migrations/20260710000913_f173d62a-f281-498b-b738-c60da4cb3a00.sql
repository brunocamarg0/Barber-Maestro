
CREATE TABLE public.platform_settings (
  id INT PRIMARY KEY DEFAULT 1,
  nome_sistema TEXT NOT NULL DEFAULT 'Barber Maestro',
  dominio TEXT NOT NULL DEFAULT 'barbermaestro.com',
  email_contato TEXT NOT NULL DEFAULT 'contato@barbermaestro.com',
  telefone_contato TEXT,
  termos_uso TEXT,
  politica_privacidade TEXT,
  modo_manutencao BOOLEAN NOT NULL DEFAULT false,
  mensagem_manutencao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT platform_settings_singleton CHECK (id = 1)
);

GRANT SELECT ON public.platform_settings TO anon, authenticated;
GRANT ALL ON public.platform_settings TO service_role;
GRANT UPDATE, INSERT ON public.platform_settings TO authenticated;

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read platform settings"
  ON public.platform_settings FOR SELECT
  USING (true);

CREATE POLICY "Super admin can insert platform settings"
  ON public.platform_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admin can update platform settings"
  ON public.platform_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.platform_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
