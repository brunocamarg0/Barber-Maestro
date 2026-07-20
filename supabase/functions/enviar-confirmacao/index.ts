import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { enviarWhatsApp, formatarDataHoraBR } from "../_shared/whatsapp.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { agendamento_id } = await req.json();
    if (!agendamento_id) {
      return new Response(JSON.stringify({ error: "agendamento_id obrigatório" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: ag, error } = await supabase
      .from("agendamentos")
      .select("id, telefone, cliente_nome, data, horario, status, confirmacao_enviada, barbearia_id, barbearias:barbearia_id(nome)")
      .eq("id", agendamento_id)
      .maybeSingle();

    if (error || !ag) {
      return new Response(JSON.stringify({ error: "agendamento não encontrado" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (ag.status !== "confirmado") {
      return new Response(JSON.stringify({ skipped: "status != confirmado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (ag.confirmacao_enviada) {
      return new Response(JSON.stringify({ skipped: "já enviado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const barbeariaNome = (ag as any).barbearias?.nome ?? "sua barbearia";
    const quando = formatarDataHoraBR(ag.data as unknown as string, ag.horario);
    const msg = `Olá ${ag.cliente_nome ?? ""}! Seu agendamento na ${barbeariaNome} foi confirmado para ${quando}. Até breve!`;

    if (ag.telefone) {
      const r = await enviarWhatsApp(ag.telefone, msg);
      if (!r.ok) throw new Error(r.error || "falha no envio");
    }

    await supabase
      .from("agendamentos")
      .update({ confirmacao_enviada: true })
      .eq("id", agendamento_id);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("enviar-confirmacao error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
