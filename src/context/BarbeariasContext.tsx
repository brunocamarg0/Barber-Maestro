import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Barbearia, NovaBarbearia, StatusBarbearia, ServicoBarbearia, NovoServicoBarbearia } from "@/types/barbearia";
import { useToast } from "@/hooks/use-toast";

interface BarbeariasContextType {
  barbearias: Barbearia[];
  isLoading: boolean;
  error: string | null;
  recarregarBarbearias: () => Promise<void>;
  adicionarBarbearia: (barbearia: NovaBarbearia) => Promise<void>;
  editarBarbearia: (id: string, dados: Partial<Barbearia>) => Promise<void>;
  alterarStatus: (id: string, status: StatusBarbearia) => Promise<void>;
  suspenderPorInadimplencia: (id: string) => Promise<void>;
  deletarBarbearia: (id: string) => Promise<void>;
  getBarbearia: (id: string) => Barbearia | undefined;
  adicionarServico: (barbeariaId: string, servico: NovoServicoBarbearia) => void;
  editarServico: (barbeariaId: string, servicoId: string, dados: Partial<ServicoBarbearia>) => void;
  removerServico: (barbeariaId: string, servicoId: string) => void;
  toggleServicoAtivo: (barbeariaId: string, servicoId: string) => void;
}

const BarbeariasContext = createContext<BarbeariasContextType | undefined>(undefined);

function mapRow(b: any): Barbearia {
  return {
    id: b.id,
    nome: b.nome,
    cnpjCpf: b.cnpj_cpf ?? "",
    responsavel: b.responsavel ?? "",
    plano: (b.plano ?? "basico") as any,
    status: (b.status ?? "em_teste") as StatusBarbearia,
    dataCriacao: (b.created_at ?? new Date().toISOString()).split("T")[0],
    dataVencimento: (b.data_vencimento ?? new Date().toISOString()).split("T")[0],
    gatewayPagamento: { nome: "", conectado: false },
    servicos: [],
    email: b.email ?? undefined,
    telefone: b.telefone ?? undefined,
    endereco: b.endereco ?? undefined,
    cidade: b.cidade ?? undefined,
    bairro: b.bairro ?? undefined,
    cep: b.cep ?? undefined,
  };
}

export function BarbeariasProvider({ children }: { children: ReactNode }) {
  const [barbearias, setBarbearias] = useState<Barbearia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const carregar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("barbearias")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBarbearias((data ?? []).map(mapRow));
    } catch (err: any) {
      console.error("[BARBEARIAS]", err);
      setError(err.message || "Erro ao carregar barbearias");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void carregar(); }, [carregar]);

  const adicionarBarbearia = async (nova: NovaBarbearia) => {
    try {
      const { error } = await supabase.from("barbearias").insert({
        nome: nova.nome,
        cnpj_cpf: nova.cnpjCpf,
        responsavel: nova.responsavel,
        plano: nova.plano,
        email: nova.email,
        telefone: nova.telefone,
        endereco: nova.endereco,
        cidade: nova.cidade,
        bairro: nova.bairro,
        cep: nova.cep,
        status: "em_teste",
      });
      if (error) throw error;
      await carregar();
      toast({ title: "Barbearia criada", description: `${nova.nome} cadastrada com sucesso.` });
    } catch (err: any) {
      toast({ title: "Erro ao criar", description: err.message, variant: "destructive" });
      throw err;
    }
  };

  const editarBarbearia = async (id: string, dados: Partial<Barbearia>) => {
    try {
      const payload: any = {};
      if (dados.nome !== undefined) payload.nome = dados.nome;
      if (dados.cnpjCpf !== undefined) payload.cnpj_cpf = dados.cnpjCpf;
      if (dados.responsavel !== undefined) payload.responsavel = dados.responsavel;
      if (dados.plano !== undefined) payload.plano = dados.plano;
      if (dados.email !== undefined) payload.email = dados.email;
      if (dados.telefone !== undefined) payload.telefone = dados.telefone;
      if (dados.endereco !== undefined) payload.endereco = dados.endereco;
      if (dados.cidade !== undefined) payload.cidade = dados.cidade;
      if (dados.bairro !== undefined) payload.bairro = dados.bairro;
      if (dados.cep !== undefined) payload.cep = dados.cep;
      const { error } = await supabase.from("barbearias").update(payload).eq("id", id);
      if (error) throw error;
      await carregar();
      toast({ title: "Barbearia atualizada", description: "Dados salvos com sucesso." });
    } catch (err: any) {
      toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
      throw err;
    }
  };

  const alterarStatus = async (id: string, status: StatusBarbearia) => {
    try {
      const { error } = await supabase.from("barbearias").update({ status }).eq("id", id);
      if (error) throw error;
      setBarbearias(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      const label = status === "ativa" ? "ativada" : status === "bloqueada" ? "bloqueada" : status === "cancelada" ? "cancelada" : "em teste";
      toast({ title: "Status alterado", description: `Barbearia ${label}.` });
    } catch (err: any) {
      toast({ title: "Erro ao alterar status", description: err.message, variant: "destructive" });
      throw err;
    }
  };

  const suspenderPorInadimplencia = async (id: string) => alterarStatus(id, "bloqueada");

  const deletarBarbearia = async (id: string) => {
    try {
      const { error } = await supabase.from("barbearias").delete().eq("id", id);
      if (error) throw error;
      setBarbearias(prev => prev.filter(b => b.id !== id));
      toast({ title: "Barbearia removida" });
    } catch (err: any) {
      toast({ title: "Erro ao remover", description: err.message, variant: "destructive" });
      throw err;
    }
  };

  const getBarbearia = (id: string) => barbearias.find(b => b.id === id);

  // Operações locais de serviços (mantidas para compat — gerenciadas no painel do dono)
  const adicionarServico = (barbeariaId: string, servico: NovoServicoBarbearia) => {
    const novo: ServicoBarbearia = { id: Date.now().toString(), ...servico };
    setBarbearias(prev => prev.map(b => b.id === barbeariaId ? { ...b, servicos: [...(b.servicos || []), novo] } : b));
  };
  const editarServico = (barbeariaId: string, servicoId: string, dados: Partial<ServicoBarbearia>) =>
    setBarbearias(prev => prev.map(b => b.id === barbeariaId ? { ...b, servicos: (b.servicos || []).map(s => s.id === servicoId ? { ...s, ...dados } : s) } : b));
  const removerServico = (barbeariaId: string, servicoId: string) =>
    setBarbearias(prev => prev.map(b => b.id === barbeariaId ? { ...b, servicos: (b.servicos || []).filter(s => s.id !== servicoId) } : b));
  const toggleServicoAtivo = (barbeariaId: string, servicoId: string) =>
    setBarbearias(prev => prev.map(b => b.id === barbeariaId ? { ...b, servicos: (b.servicos || []).map(s => s.id === servicoId ? { ...s, ativo: !s.ativo } : s) } : b));

  return (
    <BarbeariasContext.Provider value={{
      barbearias, isLoading, error,
      recarregarBarbearias: carregar,
      adicionarBarbearia, editarBarbearia, alterarStatus,
      suspenderPorInadimplencia, deletarBarbearia, getBarbearia,
      adicionarServico, editarServico, removerServico, toggleServicoAtivo,
    }}>{children}</BarbeariasContext.Provider>
  );
}

export function useBarbearias() {
  const ctx = useContext(BarbeariasContext);
  if (!ctx) throw new Error("useBarbearias deve ser usado dentro de BarbeariasProvider");
  return ctx;
}
