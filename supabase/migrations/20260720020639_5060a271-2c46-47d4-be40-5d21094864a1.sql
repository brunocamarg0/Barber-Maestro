
-- Remove leitura pública direta da tabela
DROP POLICY IF EXISTS "Anyone can read platform settings" ON public.platform_settings;
REVOKE SELECT ON public.platform_settings FROM anon;

-- Somente super-admin pode ler linhas diretamente
CREATE POLICY "Super admin can read platform settings"
  ON public.platform_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role));

-- Função pública: apenas status de manutenção
CREATE OR REPLACE FUNCTION public.get_maintenance_status()
RETURNS TABLE(modo_manutencao boolean, mensagem_manutencao text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT modo_manutencao, mensagem_manutencao
  FROM public.platform_settings
  WHERE id = 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_maintenance_status() TO anon, authenticated;

-- Função pública: textos legais (termos / política)
CREATE OR REPLACE FUNCTION public.get_legal_text(_campo text)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result text;
BEGIN
  IF _campo NOT IN ('termos_uso', 'politica_privacidade') THEN
    RAISE EXCEPTION 'Campo inválido';
  END IF;
  IF _campo = 'termos_uso' THEN
    SELECT termos_uso INTO v_result FROM public.platform_settings WHERE id = 1;
  ELSE
    SELECT politica_privacidade INTO v_result FROM public.platform_settings WHERE id = 1;
  END IF;
  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_legal_text(text) TO anon, authenticated;
