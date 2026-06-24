// Edge function: aprovar solicitação de cadastro
// Cria auth user + barbearia + user_role owner + envia email com senha temporária
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  solicitacao_id: string;
  observacoes?: string;
}

function gerarSenhaTemp() {
  const a = Math.random().toString(36).slice(-8);
  const b = Math.random().toString(36).slice(-4).toUpperCase();
  return `${a}${b}!@`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(supabaseUrl, serviceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "super_admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Apenas super_admin pode aprovar" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Payload;
    if (!body.solicitacao_id) {
      return new Response(JSON.stringify({ error: "solicitacao_id obrigatório" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: sol, error: solErr } = await admin
      .from("solicitacoes_cadastro").select("*").eq("id", body.solicitacao_id).single();
    if (solErr || !sol) {
      return new Response(JSON.stringify({ error: "Solicitação não encontrada" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (sol.status !== "pendente") {
      return new Response(JSON.stringify({ error: "Solicitação já processada" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senha = gerarSenhaTemp();
    const email = String(sol.email).trim().toLowerCase();

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome: sol.responsavel, telefone: sol.telefone ?? null },
    });
    if (createErr || !created.user) {
      const msg = createErr?.message || "Erro ao criar usuário";
      return new Response(JSON.stringify({ error: msg }), {
        status: msg.toLowerCase().includes("already") ? 409 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = created.user.id;

    const { data: barbearia, error: barbErr } = await admin.from("barbearias").insert({
      nome: sol.nome,
      cnpj_cpf: sol.cnpj_cpf || "",
      responsavel: sol.responsavel,
      plano: sol.plano || "basico",
      email: sol.email,
      telefone: sol.telefone,
      endereco: sol.endereco,
      status: "em_teste",
    }).select().single();

    if (barbErr || !barbearia) {
      await admin.auth.admin.deleteUser(userId).catch(() => {});
      return new Response(JSON.stringify({ error: barbErr?.message || "Erro ao criar barbearia" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: roleErr } = await admin.from("user_roles").insert({
      user_id: userId, role: "owner", barbearia_id: barbearia.id,
    });
    if (roleErr) {
      await admin.from("barbearias").delete().eq("id", barbearia.id);
      await admin.auth.admin.deleteUser(userId).catch(() => {});
      return new Response(JSON.stringify({ error: roleErr.message }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // limpa role client criada pelo trigger
    await admin.from("user_roles").delete().eq("user_id", userId).eq("role", "client");
    await admin.from("clientes").delete().eq("user_id", userId);
    await admin.from("donos_barbearia").insert({ user_id: userId, barbearia_id: barbearia.id });

    // atualiza solicitação
    await admin.from("solicitacoes_cadastro").update({
      status: "aprovada",
      barbearia_id: barbearia.id,
      aprovada_em: new Date().toISOString(),
      aprovada_por: userData.user.id,
      observacoes: body.observacoes ?? null,
    }).eq("id", sol.id);

    // email com senha temporária
    try {
      await admin.functions.invoke("send-transactional-email", {
        body: {
          templateName: "boas-vindas-dono",
          recipientEmail: email,
          idempotencyKey: `aprovacao-${sol.id}`,
          templateData: {
            nomeDono: sol.responsavel,
            nomeBarbearia: sol.nome,
            senhaTemporaria: senha,
          },
        },
      });
    } catch (e) {
      console.error("Falha ao enviar email (não crítico)", e);
    }

    return new Response(JSON.stringify({
      success: true, user_id: userId, barbearia_id: barbearia.id, senha_temporaria: senha,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("aprovar-solicitacao error", err);
    return new Response(JSON.stringify({ error: (err as Error).message || "Erro" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
