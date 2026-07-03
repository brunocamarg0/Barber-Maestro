CREATE OR REPLACE FUNCTION public.is_member_of_barbearia(_user_id uuid, _barbearia_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND barbearia_id = _barbearia_id
      AND role IN ('owner'::app_role, 'professional'::app_role)
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_member_of_barbearia(uuid, uuid) TO authenticated, service_role;