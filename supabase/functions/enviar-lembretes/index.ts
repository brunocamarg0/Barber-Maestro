import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { enviarWhatsApp, formatarDataHoraBR } from "../_shared/whatsapp.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const agora = new Date();
  const emUmaHora = new Date(agora.getTime() + 60 * 60 * 1000);

  const { data: ags, error } = await supabase
    .from("agendamentos")
    .select("id, telefone, cliente_nome, data, horario, barbearia_id, barbearias:barbearia_id(nome)")
    .eq("status", "confirmado")
    .eq("lembrete_enviado", false)
    .gte("data", agora.toISOString())
    .lte("data", emUmaHora.toISOString());

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let enviados = 0;
  for (const ag of ags ?? []) {
    try {
      const barbeariaNome = (ag as any).barbearias?.nome ?? "sua barbearia";
      const quando = formatarDataHoraBR(ag.data as unknown as string, ag.horario);
      const msg = `Olá ${ag.cliente_nome ?? ""}! Lembrete do seu agendamento na ${barbeariaNome}: ${quando}. Nos vemos em breve!`;
      if (ag.telefone) await enviarWhatsApp(ag.telefone, msg);
      await supabase.from("agendamentos").update({ lembrete_enviado: true }).eq("id", ag.id);
      enviados++;
    } catch (e) {
      console.error("lembrete falhou", ag.id, e);
    }
  }

  return new Response(JSON.stringify({ ok: true, enviados, total: ags?.length ?? 0 }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
