// Webhook do Mercado Pago — atualiza status do pagamento.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const mpToken =
      Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") ||
      Deno.env.get("MERCADOPAGO_ACCESS_TOKEN_TEST");

    const body = await req.json().catch(() => ({}));
    const paymentId =
      body?.data?.id || new URL(req.url).searchParams.get("data.id");

    if (!paymentId || !mpToken) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mpRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${mpToken}` } }
    );
    if (!mpRes.ok) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const payment = await mpRes.json();
    const agendamentoId: string | undefined = payment.external_reference;
    const status = payment.status as string;

    const admin = createClient(supabaseUrl, serviceKey);

    const mapped =
      status === "approved"
        ? "pago"
        : status === "rejected" || status === "cancelled"
        ? "cancelado"
        : status === "pending" || status === "in_process"
        ? "processando"
        : status;

    if (agendamentoId) {
      await admin
        .from("pagamentos")
        .update({
          status: mapped,
          mercadopago_payment_id: String(paymentId),
          mercadopago_status: status,
          mercadopago_payment_type: payment.payment_type_id ?? null,
          data_pagamento: status === "approved" ? new Date().toISOString() : null,
        })
        .eq("agendamento_id", agendamentoId);

      if (status === "approved") {
        await admin
          .from("agendamentos")
          .update({ status: "confirmado" })
          .eq("id", agendamentoId);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("webhook error:", e);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
