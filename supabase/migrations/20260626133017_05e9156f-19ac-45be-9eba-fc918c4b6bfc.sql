
REVOKE EXECUTE ON FUNCTION public.has_feature(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_plano_ativo(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_feature(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_plano_ativo(uuid) TO authenticated, service_role;
