CREATE OR REPLACE FUNCTION public.rate_limit_solicitacoes_cadastro()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email_count INT;
  v_doc_count INT;
  v_global_count INT;
  v_doc TEXT;
BEGIN
  v_doc := regexp_replace(COALESCE(NEW.cnpj_cpf, ''), '\D', '', 'g');

  SELECT COUNT(*) INTO v_email_count
  FROM public.solicitacoes_cadastro
  WHERE lower(email) = lower(NEW.email)
    AND created_at > now() - interval '1 hour';
  IF v_email_count >= 3 THEN
    RAISE EXCEPTION 'Muitas solicitações com este email. Tente novamente mais tarde.';
  END IF;

  IF length(v_doc) > 0 THEN
    SELECT COUNT(*) INTO v_doc_count
    FROM public.solicitacoes_cadastro
    WHERE regexp_replace(COALESCE(cnpj_cpf, ''), '\D', '', 'g') = v_doc
      AND created_at > now() - interval '1 hour';
    IF v_doc_count >= 3 THEN
      RAISE EXCEPTION 'Muitas solicitações com este documento. Tente novamente mais tarde.';
    END IF;
  END IF;

  SELECT COUNT(*) INTO v_global_count
  FROM public.solicitacoes_cadastro
  WHERE created_at > now() - interval '1 hour';
  IF v_global_count >= 20 THEN
    RAISE EXCEPTION 'Limite de solicitações atingido. Tente novamente em alguns minutos.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS rate_limit_solicitacoes_cadastro_trigger ON public.solicitacoes_cadastro;
CREATE TRIGGER rate_limit_solicitacoes_cadastro_trigger
BEFORE INSERT ON public.solicitacoes_cadastro
FOR EACH ROW EXECUTE FUNCTION public.rate_limit_solicitacoes_cadastro();