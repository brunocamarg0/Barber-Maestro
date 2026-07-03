// Cobrança recorrente mensal das assinaturas dos donos (SaaS).
// Chamada diariamente via cron. Para cada assinatura ativa com
// pagamento_recorrente=true e proximo_vencimento nos próximos 3 dias
// (e sem cobrança pendente aberta), cria uma preferência no Mercado Pago
// e registra em pagamentos_assinatura. Se vencida há mais de 7 dias sem
// pagamento aprovado, marca a assinatura como "atrasada".

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

const DIAS_ANTES = 3;        // gera cobrança N dias antes do vencimento
const DIAS_GRACA = 7;        // após vencer, N dias até marcar como atrasada

async function criarPreferenciaMP(params: {
  assinaturaId: string;
  planoNome: string;
  valor: number;
  email: string;
  nome: string;
}) {
  const preference = {
    items: [{
      id: `assinatura-${params.assinaturaId}`,
      title: `Mensalidade - ${params.planoNome}`,
      description: `Renovação mensal Barber Maestro`,
      quantity: 1,
      unit_price: Number(params.valor),
      currency_id: "BRL",
    }],
    payer: { name: params.nome || params.email, email: params.email },
    back_urls: {
      success: "https://barbermaestro.com/dono?cobranca=ok",
      failure: "https://barbermaestro.com/dono?cobranca=falha",
      pending: "https://barbermaestro.com/dono?cobranca=pendente",
    },
    auto_return: "approved",
    statement_descriptor: "BARBER MAESTRO",
    metadata: { tipo: "assinatura_dono_recorrente", assinatura_id: params.assinaturaId },
    external_reference: `assinatura_${params.assinaturaId}_${Date.now()}`,
  };

  const resp = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: { Authorization: `Bearer ${MP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(preference),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`MP: ${data?.message || JSON.stringify(data)}`);
  return { preferenceId: data.id as string, link: data.init_point as string };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const resumo = { geradas: 0, atrasadas: 0, erros: [] as any[] };

  try {
    const hoje = new Date();
    const limiteFuturo = new Date(hoje.getTime() + DIAS_ANTES * 24 * 3600 * 1000);
    const limitePassadoGraca = new Date(hoje.getTime() - DIAS_GRACA * 24 * 3600 * 1000);

    // 1) Assinaturas a cobrar (recorrentes, ativas, vencendo em breve)
    const { data: aCobrar, error: e1 } = await admin
      .from("assinaturas")
      .select("id, barbearia_id, plano_id, proximo_vencimento, pagamento_recorrente, status, planos(nome, valor_mensal), barbearias(nome, email)")
      .eq("pagamento_recorrente", true)
      .in("status", ["ativa", "em_dia", "em_teste", "atrasada"])
      .lte("proximo_vencimento", limiteFuturo.toISOString());

    if (e1) throw e1;

    for (const a of aCobrar ?? []) {
      try {
        // Já existe cobrança pendente aberta para este ciclo?
        const { data: pend } = await admin
          .from("pagamentos_assinatura")
          .select("id")
          .eq("assinatura_id", a.id)
          .in("status", ["pendente", "aguardando"])
          .gte("created_at", new Date(hoje.getTime() - 20 * 24 * 3600 * 1000).toISOString())
          .limit(1);
        if (pend && pend.length > 0) continue;

        const plano: any = a.planos;
        const barb: any = a.barbearias;
        const valor = Number(plano?.valor_mensal ?? 0);
        if (!valor || valor <= 0) continue;

        const { preferenceId, link } = await criarPreferenciaMP({
          assinaturaId: a.id,
          planoNome: plano?.nome ?? "Assinatura",
          valor,
          email: barb?.email ?? "",
          nome: barb?.nome ?? "",
        });

        await admin.from("pagamentos_assinatura").insert({
          assinatura_id: a.id,
          valor,
          data_vencimento: a.proximo_vencimento,
          status: "pendente",
          metodo_pagamento: "mercadopago",
          mercadopago_preference_id: preferenceId,
          link_pagamento: link,
          observacoes: "Cobrança recorrente automática",
        });

        // Notifica o dono por e-mail (best-effort — não bloqueia)
        if (barb?.email) {
          try {
            const dataVenc = new Date(a.proximo_vencimento).toLocaleDateString("pt-BR");
            const valorFmt = new Intl.NumberFormat("pt-BR", {
              style: "currency", currency: "BRL",
            }).format(valor);
            await admin.functions.invoke("send-transactional-email", {
              body: {
                template: "cobranca-gerada",
                to: barb.email,
                data: {
                  nomeDono: barb?.nome ?? "Barbeiro",
                  nomeBarbearia: barb?.nome ?? "sua barbearia",
                  planoNome: plano?.nome ?? "seu plano",
                  valor: valorFmt,
                  dataVencimento: dataVenc,
                  linkPagamento: link,
                },
              },
            });
          } catch (mailErr) {
            console.error("Falha ao enviar e-mail de cobrança", a.id, mailErr);
          }
        }

        resumo.geradas++;
      } catch (e: any) {
        console.error("Falha ao cobrar assinatura", a.id, e);
        resumo.erros.push({ id: a.id, erro: e?.message });
      }
    }

    // 2) Assinaturas vencidas há mais de N dias sem pagamento → atrasada
    const { data: vencidas } = await admin
      .from("assinaturas")
      .select("id, proximo_vencimento, status")
      .lt("proximo_vencimento", limitePassadoGraca.toISOString())
      .in("status", ["ativa", "em_dia", "em_teste"]);

    for (const a of vencidas ?? []) {
      await admin.from("assinaturas").update({ status: "atrasada" }).eq("id", a.id);
      resumo.atrasadas++;
    }

    return new Response(JSON.stringify({ ok: true, ...resumo }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("cobranca-recorrente error:", e);
    return new Response(JSON.stringify({ ok: false, error: e?.message, ...resumo }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
