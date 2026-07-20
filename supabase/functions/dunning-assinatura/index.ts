// Dunning e trial das assinaturas de dono.
// Roda 1x/dia via cron.
//
// Regras:
// - Trial (7 dias, status 'em_teste'): no vencimento (trial_ate < now)
//   sem pagamento aprovado → status='suspensa', bloqueada_em=now, barbearia.status='suspensa'.
//   Email "trial expirado" ao proprietário.
// - Ativa/em_atraso vencida:
//     D+1  → tentativa 1: envia email cobrança + gera novo link MP
//     D+3  → tentativa 2: reenvia
//     D+5  → tentativa 3: reenvia
//     D+6+ → suspende (status='suspensa', bloqueada_em=now, barbearia.status='suspensa')
// - Se pagamento aprovar (via webhook), o webhook mesmo já move proximo_vencimento
//   e zera tentativas/bloqueio.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MP_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

const RETRY_DAYS = [1, 3, 5];
const SUSPEND_AFTER = 6;

async function criarLinkMP(a: any): Promise<string | null> {
  try {
    const preference = {
      items: [{
        id: `assinatura-${a.id}`,
        title: `Renovação - ${a.planos?.nome || "Plano"}`,
        quantity: 1,
        unit_price: Number(a.planos?.valor_mensal || 0),
        currency_id: "BRL",
      }],
      payer: { email: a.barbearias?.email, name: a.barbearias?.nome },
      back_urls: {
        success: "https://barbermaestro.com/dono/assinatura?cobranca=ok",
        failure: "https://barbermaestro.com/dono/assinatura?cobranca=falha",
        pending: "https://barbermaestro.com/dono/assinatura?cobranca=pendente",
      },
      auto_return: "approved",
      metadata: { tipo: "assinatura_dono_recorrente", assinatura_id: a.id },
      external_reference: `assinatura_${a.id}_${Date.now()}`,
    };
    const resp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { Authorization: `Bearer ${MP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(preference),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.message || "MP err");
    return data.init_point as string;
  } catch (e) {
    console.error("criarLinkMP:", e);
    return null;
  }
}

async function enviarEmail(templateName: string, email: string, data: any) {
  try {
    await admin.functions.invoke("send-transactional-email", {
      body: {
        templateName,
        recipientEmail: email,
        idempotencyKey: `${templateName}-${data.assinaturaId}-${new Date().toISOString().slice(0, 10)}`,
        templateData: data,
      },
    });
  } catch (e) {
    console.warn("email falhou:", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const resumo = { trials_expirados: 0, cobrancas_enviadas: 0, suspensas: 0, erros: [] as any[] };

  try {
    const agora = new Date();

    // 1) Trials expirados
    const { data: trials } = await admin
      .from("assinaturas")
      .select("id, barbearia_id, trial_ate, barbearias(nome, email)")
      .eq("status", "em_teste")
      .lt("trial_ate", agora.toISOString());

    for (const t of trials || []) {
      await admin
        .from("assinaturas")
        .update({
          status: "suspensa",
          bloqueada_em: agora.toISOString(),
          motivo_bloqueio: "trial_expirado",
        })
        .eq("id", t.id);
      await admin.from("barbearias").update({ status: "suspensa" }).eq("id", t.barbearia_id);
      if ((t as any).barbearias?.email) {
        await enviarEmail("cobranca-gerada", (t as any).barbearias.email, {
          assinaturaId: t.id,
          nomeDono: (t as any).barbearias.nome,
          assunto: "Seu teste gratuito expirou",
          mensagem: "Seu período de 7 dias acabou. Assine agora para continuar usando o Barber Maestro.",
        });
      }
      resumo.trials_expirados++;
    }

    // 2) Assinaturas ativas vencidas → dunning
    const { data: atrasadas } = await admin
      .from("assinaturas")
      .select("id, barbearia_id, proximo_vencimento, tentativas_cobranca, ultima_tentativa, status, planos(nome, valor_mensal), barbearias(nome, email)")
      .in("status", ["ativa", "em_dia", "em_atraso", "atrasada"])
      .lt("proximo_vencimento", agora.toISOString());

    for (const a of atrasadas || []) {
      const diasAtraso = Math.floor(
        (agora.getTime() - new Date((a as any).proximo_vencimento).getTime()) / 86400000,
      );

      if (diasAtraso >= SUSPEND_AFTER) {
        await admin
          .from("assinaturas")
          .update({
            status: "suspensa",
            bloqueada_em: agora.toISOString(),
            motivo_bloqueio: "inadimplente",
          })
          .eq("id", a.id);
        await admin.from("barbearias").update({ status: "suspensa" }).eq("id", (a as any).barbearia_id);
        resumo.suspensas++;
        continue;
      }

      if (!RETRY_DAYS.includes(diasAtraso)) continue;

      // Envia cobrança se ainda não enviou hoje
      const ultima = (a as any).ultima_tentativa ? new Date((a as any).ultima_tentativa) : null;
      if (ultima && ultima.toDateString() === agora.toDateString()) continue;

      const link = await criarLinkMP(a);
      await admin
        .from("assinaturas")
        .update({
          status: "em_atraso",
          tentativas_cobranca: ((a as any).tentativas_cobranca || 0) + 1,
          ultima_tentativa: agora.toISOString(),
        })
        .eq("id", a.id);

      if ((a as any).barbearias?.email) {
        await enviarEmail("cobranca-gerada", (a as any).barbearias.email, {
          assinaturaId: a.id,
          nomeDono: (a as any).barbearias.nome,
          valor: Number((a as any).planos?.valor_mensal || 0),
          linkPagamento: link,
          diasAtraso,
          assunto: `Sua assinatura está ${diasAtraso} dia(s) em atraso`,
        });
      }
      resumo.cobrancas_enviadas++;
    }

    return new Response(JSON.stringify({ ok: true, resumo }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("dunning erro:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
