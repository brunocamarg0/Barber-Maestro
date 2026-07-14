
-- Explicit RESTRICTIVE DELETE policy on user_roles: only super_admin can delete
CREATE POLICY "Bloquear delete em user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Explicit RESTRICTIVE SELECT policy on barbearias: sensitive columns only via authenticated owner/super_admin
-- Blocks any accidental future PERMISSIVE public/anon SELECT policy from exposing sensitive fields.
CREATE POLICY "Restringir SELECT direto em barbearias"
ON public.barbearias
AS RESTRICTIVE
FOR SELECT
TO public
USING (
  auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'super_admin'::app_role)
    OR (id = get_user_barbearia_id(auth.uid()) AND has_role(auth.uid(), 'owner'::app_role))
    OR is_member_of_barbearia(auth.uid(), id)
  )
);

-- Revoke direct anon SELECT on barbearias to force use of sanitized RPC functions
REVOKE SELECT ON public.barbearias FROM anon;
