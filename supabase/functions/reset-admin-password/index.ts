// One-shot: reseta senha do super-admin. APAGAR após uso.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const email = "brunocamargocontato@hotmail.com";
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (listErr) return new Response(JSON.stringify({ error: listErr.message }), { status: 500 });
  const user = list.users.find(u => (u.email ?? "").toLowerCase() === email);
  if (!user) return new Response(JSON.stringify({ error: "user not found" }), { status: 404 });
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    password: "Admin@1706",
    email_confirm: true,
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ ok: true, email }), { headers: { "Content-Type": "application/json" } });
});
