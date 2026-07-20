import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Confirma automaticamente agendamentos "pendente" em barbearias com
// modo_confirmacao = 'hibrido' criados há mais de 2h.
// A atualização de status dispara o trigger que chama enviar-confirmacao.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const duasHorasAtras = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { data: ags, error } = await supabase
    .from("agendamentos")
    .select("id, barbearia_id, barbearias:barbearia_id(modo_confirmacao)")
    .eq("status", "pendente")
    .lte("created_at", duasHorasAtras);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const alvos = (ags ?? []).filter((a: any) => a.barbearias?.modo_confirmacao === "hibrido");
  let confirmados = 0;
  for (const a of alvos) {
    const { error: upErr } = await supabase
      .from("agendamentos")
      .update({ status: "confirmado", confirmado_automaticamente: true, data_confirmacao_automatica: new Date().toISOString() })
      .eq("id", a.id);
    if (!upErr) confirmados++;
  }

  return new Response(JSON.stringify({ ok: true, confirmados, avaliados: alvos.length }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
