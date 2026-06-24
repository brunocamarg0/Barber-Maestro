import { supabase } from "@/integrations/supabase/client";

export interface SolicitacaoCadastro {
  id: string;
  nome: string;
  cnpjCpf: string;
  responsavel: string;
  email: string;
  telefone?: string | null;
  endereco?: string | null;
  plano: string;
  status: string;
  observacoes?: string | null;
  createdAt: string;
}

function mapRow(r: any): SolicitacaoCadastro {
  return {
    id: r.id,
    nome: r.nome,
    cnpjCpf: r.cnpj_cpf,
    responsavel: r.responsavel,
    email: r.email,
    telefone: r.telefone,
    endereco: r.endereco,
    plano: r.plano,
    status: r.status,
    observacoes: r.observacoes,
    createdAt: r.created_at,
  };
}

export async function listarSolicitacoesCloud(status?: string): Promise<SolicitacaoCadastro[]> {
  let q = supabase.from("solicitacoes_cadastro").select("*").order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function aprovarSolicitacaoCloud(id: string, observacoes?: string) {
  const { data, error } = await supabase.functions.invoke("aprovar-solicitacao", {
    body: { solicitacao_id: id, observacoes },
  });
  if (error) throw new Error(error.message);
  if ((data as any)?.error) throw new Error((data as any).error);
  return data;
}

export async function rejeitarSolicitacaoCloud(id: string, observacoes?: string) {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("solicitacoes_cadastro").update({
    status: "rejeitada",
    observacoes: observacoes ?? null,
    aprovada_por: userData.user?.id ?? null,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}
