
CREATE OR REPLACE FUNCTION public.search_barbearias_publicas(_busca text DEFAULT NULL::text, _cidade text DEFAULT NULL::text, _bairro text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, slug text, nome text, foto text, endereco text, cidade text, bairro text, telefone text, latitude double precision, longitude double precision, modo_confirmacao text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT b.id, b.slug, b.nome, b.foto, b.endereco, b.cidade, b.bairro,
         b.telefone, b.latitude, b.longitude, b.modo_confirmacao
  FROM public.barbearias b
  WHERE b.status IN ('ativa','em_teste')
    AND (_busca IS NULL OR b.nome ILIKE '%' || _busca || '%')
    AND (_cidade IS NULL OR b.cidade ILIKE '%' || _cidade || '%')
    AND (_bairro IS NULL OR b.bairro ILIKE '%' || _bairro || '%')
  ORDER BY b.nome;
$function$;

CREATE OR REPLACE FUNCTION public.get_barbearia_publica_by_id(_id uuid)
 RETURNS TABLE(id uuid, slug text, nome text, foto text, endereco text, cidade text, bairro text, telefone text, latitude double precision, longitude double precision, modo_confirmacao text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT b.id, b.slug, b.nome, b.foto, b.endereco, b.cidade, b.bairro,
         b.telefone, b.latitude, b.longitude, b.modo_confirmacao
  FROM public.barbearias b
  WHERE b.id = _id AND b.status IN ('ativa','em_teste');
$function$;

CREATE OR REPLACE FUNCTION public.get_barbearia_publica_by_slug(_slug text)
 RETURNS TABLE(id uuid, slug text, nome text, foto text, endereco text, cidade text, bairro text, telefone text, latitude double precision, longitude double precision, modo_confirmacao text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT b.id, b.slug, b.nome, b.foto, b.endereco, b.cidade, b.bairro,
         b.telefone, b.latitude, b.longitude, b.modo_confirmacao
  FROM public.barbearias b
  WHERE b.slug = _slug AND b.status IN ('ativa','em_teste');
$function$;
