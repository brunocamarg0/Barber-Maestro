-- 1) Restrict public barbershop RPCs to non-sensitive fields and only active shops
DROP FUNCTION IF EXISTS public.get_barbearia_publica_by_slug(text);
DROP FUNCTION IF EXISTS public.get_barbearia_publica_by_id(uuid);
DROP FUNCTION IF EXISTS public.search_barbearias_publicas(text, text, text);

CREATE OR REPLACE FUNCTION public.get_barbearia_publica_by_slug(_slug text)
 RETURNS TABLE(id uuid, slug text, nome text, foto text, endereco text, cidade text, bairro text, telefone text, latitude double precision, longitude double precision, modo_confirmacao text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT b.id, b.slug, b.nome, b.foto, b.endereco, b.cidade, b.bairro,
         b.telefone, b.latitude, b.longitude, b.modo_confirmacao
  FROM public.barbearias b
  WHERE b.slug = _slug AND b.status = 'ativa';
$function$;

CREATE OR REPLACE FUNCTION public.get_barbearia_publica_by_id(_id uuid)
 RETURNS TABLE(id uuid, slug text, nome text, foto text, endereco text, cidade text, bairro text, telefone text, latitude double precision, longitude double precision, modo_confirmacao text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT b.id, b.slug, b.nome, b.foto, b.endereco, b.cidade, b.bairro,
         b.telefone, b.latitude, b.longitude, b.modo_confirmacao
  FROM public.barbearias b
  WHERE b.id = _id AND b.status = 'ativa';
$function$;

CREATE OR REPLACE FUNCTION public.search_barbearias_publicas(_busca text DEFAULT NULL, _cidade text DEFAULT NULL, _bairro text DEFAULT NULL)
 RETURNS TABLE(id uuid, slug text, nome text, foto text, endereco text, cidade text, bairro text, telefone text, latitude double precision, longitude double precision, modo_confirmacao text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT b.id, b.slug, b.nome, b.foto, b.endereco, b.cidade, b.bairro,
         b.telefone, b.latitude, b.longitude, b.modo_confirmacao
  FROM public.barbearias b
  WHERE b.status = 'ativa'
    AND (_busca IS NULL OR b.nome ILIKE '%' || _busca || '%')
    AND (_cidade IS NULL OR b.cidade ILIKE '%' || _cidade || '%')
    AND (_bairro IS NULL OR b.bairro ILIKE '%' || _bairro || '%')
  ORDER BY b.nome;
$function$;

-- 2) Validate telefone/cliente_nome on agendamentos
CREATE OR REPLACE FUNCTION public.validate_agendamento_input()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.cliente_nome IS NOT NULL THEN
    NEW.cliente_nome := btrim(NEW.cliente_nome);
    IF length(NEW.cliente_nome) > 120 THEN
      RAISE EXCEPTION 'cliente_nome excede 120 caracteres';
    END IF;
  END IF;
  IF NEW.telefone IS NOT NULL THEN
    NEW.telefone := btrim(NEW.telefone);
    IF length(NEW.telefone) > 0 AND length(regexp_replace(NEW.telefone, '\D', '', 'g')) NOT BETWEEN 8 AND 15 THEN
      RAISE EXCEPTION 'telefone inválido';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_validate_agendamento_input ON public.agendamentos;
CREATE TRIGGER trg_validate_agendamento_input
BEFORE INSERT OR UPDATE ON public.agendamentos
FOR EACH ROW EXECUTE FUNCTION public.validate_agendamento_input();

-- 3) Restrict notificacoes owner policies to authenticated role
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='notificacoes'
      AND policyname IN ('Dono vê notificações da sua barbearia', 'Dono atualiza notificações da sua barbearia')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.notificacoes', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Dono vê notificações da sua barbearia"
ON public.notificacoes FOR SELECT TO authenticated
USING (
  barbearia_id = public.get_user_barbearia_id(auth.uid())
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Dono atualiza notificações da sua barbearia"
ON public.notificacoes FOR UPDATE TO authenticated
USING (
  barbearia_id = public.get_user_barbearia_id(auth.uid())
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
)
WITH CHECK (
  barbearia_id = public.get_user_barbearia_id(auth.uid())
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
);