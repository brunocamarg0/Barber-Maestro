import { createContext, useContext, useState, ReactNode } from "react";
import {
  KPI,
  AgendamentoDono,
  ProfissionalDono,
  ClienteDono,
  PagamentoDono,
  PromocaoDono,
  AvaliacaoDono,
  ProdutoDono,
  NotificacaoDono,
  ConfiguracaoBarbearia,
  RelatorioDono,
} from "@/types/dono";

interface DonoContextType {
  // Dados
  kpi: KPI;
  agendamentos: AgendamentoDono[];
  profissionais: ProfissionalDono[];
  clientes: ClienteDono[];
  pagamentos: PagamentoDono[];
  promocoes: PromocaoDono[];
  avaliacoes: AvaliacaoDono[];
  produtos: ProdutoDono[];
  notificacoes: NotificacaoDono[];
  configuracao: ConfiguracaoBarbearia;
  
  // Funções
  criarAgendamento: (agendamento: Omit<AgendamentoDono, "id" | "dataCriacao">) => void;
  atualizarAgendamento: (id: string, dados: Partial<AgendamentoDono>) => void;
  cancelarAgendamento: (id: string) => void;
  
  adicionarProfissional: (profissional: Omit<ProfissionalDono, "id" | "dataAdmissao" | "avaliacaoMedia" | "totalAvaliacoes" | "faturamentoTotal" | "faltas">) => void;
  atualizarProfissional: (id: string, dados: Partial<ProfissionalDono>) => void;
  removerProfissional: (id: string) => void;
  
  adicionarCliente: (cliente: Omit<ClienteDono, "id" | "dataCadastro" | "totalAgendamentos" | "ticketMedio" | "frequencia">) => void;
  atualizarCliente: (id: string, dados: Partial<ClienteDono>) => void;
  marcarClienteVIP: (id: string, vip: boolean) => void;
  
  registrarPagamento: (pagamento: Omit<PagamentoDono, "id">) => void;
  
  criarPromocao: (promocao: Omit<PromocaoDono, "id">) => void;
  atualizarPromocao: (id: string, dados: Partial<PromocaoDono>) => void;
  
  responderAvaliacao: (id: string, resposta: string) => void;
  
  adicionarProduto: (produto: Omit<ProdutoDono, "id">) => void;
  atualizarProduto: (id: string, dados: Partial<ProdutoDono>) => void;
  atualizarEstoque: (id: string, quantidade: number) => void;
  
  marcarNotificacaoLida: (id: string) => void;
  
  atualizarConfiguracao: (dados: Partial<ConfiguracaoBarbearia>) => void;
  
  gerarRelatorio: (dataInicio: string, dataFim: string) => RelatorioDono;
}

const DonoContext = createContext<DonoContextType | undefined>(undefined);

// Dados mockados iniciais
const kpiInicial: KPI = {
  faturamentoHoje: 450.00,
  faturamentoSemana: 3200.00,
  faturamentoMes: 12500.00,
  agendamentosHoje: 12,
  cancelamentos: 2,
  clientesRecorrentes: 45,
  notaMedia: 4.8,
};

const profissionaisIniciais: ProfissionalDono[] = [
  {
    id: "1",
    nome: "Carlos Barbeiro",
    telefone: "(11) 99999-9999",
    especialidades: ["Corte", "Barba", "Hidratação"],
    comissao: { tipo: "percentual", valor: 40 },
    ativo: true,
    dataAdmissao: "2024-01-15",
    avaliacaoMedia: 4.9,
    totalAvaliacoes: 120,
    faturamentoTotal: 15000.00,
    faltas: 0,
  },
  {
    id: "2",
    nome: "João Silva",
    telefone: "(11) 88888-8888",
    especialidades: ["Corte", "Alisamento"],
    comissao: { tipo: "percentual", valor: 35 },
    ativo: true,
    dataAdmissao: "2024-02-01",
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 85,
    faturamentoTotal: 9800.00,
    faltas: 1,
  },
];

const clientesIniciais: ClienteDono[] = [
  {
    id: "1",
    nome: "Pedro Santos",
    telefone: "(11) 77777-7777",
    vip: true,
    totalAgendamentos: 15,
    ultimoAgendamento: "2024-03-15",
    ticketMedio: 45.00,
    frequencia: 2,
    dataCadastro: "2024-01-10",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    telefone: "(11) 66666-6666",
    vip: false,
    totalAgendamentos: 8,
    ultimoAgendamento: "2024-03-10",
    ticketMedio: 35.00,
    frequencia: 1,
    dataCadastro: "2024-02-05",
  },
];

const agendamentosIniciais: AgendamentoDono[] = [
  {
    id: "1",
    clienteId: "1",
    clienteNome: "Pedro Santos",
    profissionalId: "1",
    profissionalNome: "Carlos Barbeiro",
    servicoId: "s1",
    servicoNome: "Corte + Barba",
    data: new Date().toISOString().split("T")[0],
    horario: "14:00",
    duracao: 60,
    valor: 45.00,
    status: "confirmado",
    dataCriacao: new Date().toISOString(),
  },
];

const produtosIniciais: ProdutoDono[] = [
  {
    id: "1",
    nome: "Pomada Modeladora Premium",
    categoria: "pomada",
    preco: 25.00,
    estoque: 15,
    estoqueMinimo: 5,
    ativo: true,
  },
  {
    id: "2",
    nome: "Óleo Capilar Hidratante",
    categoria: "oleo",
    preco: 30.00,
    estoque: 8,
    estoqueMinimo: 3,
    ativo: true,
  },
];

const configuracaoInicial: ConfiguracaoBarbearia = {
  id: "1",
  nome: "Barbearia do João",
  cnpjCpf: "12.345.678/0001-90",
  horarioFuncionamento: {
    segunda: { aberto: true, inicio: "09:00", fim: "18:00" },
    terca: { aberto: true, inicio: "09:00", fim: "18:00" },
    quarta: { aberto: true, inicio: "09:00", fim: "18:00" },
    quinta: { aberto: true, inicio: "09:00", fim: "18:00" },
    sexta: { aberto: true, inicio: "09:00", fim: "19:00" },
    sabado: { aberto: true, inicio: "08:00", fim: "17:00" },
    domingo: { aberto: false, inicio: "09:00", fim: "13:00" },
  },
  politicaCancelamento: {
    prazoMinimo: 2,
    permitirReagendamento: true,
  },
  linkAgendamento: "https://barberpro.com/agendar/joao",
  paginaPublica: true,
};

export function DonoProvider({ children }: { children: ReactNode }) {
  const [kpi, setKpi] = useState<KPI>(kpiInicial);
  const [agendamentos, setAgendamentos] = useState<AgendamentoDono[]>(agendamentosIniciais);
  const [profissionais, setProfissionais] = useState<ProfissionalDono[]>(profissionaisIniciais);
  const [clientes, setClientes] = useState<ClienteDono[]>(clientesIniciais);
  const [pagamentos, setPagamentos] = useState<PagamentoDono[]>([]);
  const [promocoes, setPromocoes] = useState<PromocaoDono[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoDono[]>([]);
  const [produtos, setProdutos] = useState<ProdutoDono[]>(produtosIniciais);
  const [notificacoes, setNotificacoes] = useState<NotificacaoDono[]>([]);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoBarbearia>(configuracaoInicial);

  // Funções de agendamento
  const criarAgendamento = (agendamento: Omit<AgendamentoDono, "id" | "dataCriacao">) => {
    const novo: AgendamentoDono = {
      id: Date.now().toString(),
      ...agendamento,
      dataCriacao: new Date().toISOString(),
    };
    setAgendamentos([...agendamentos, novo]);
  };

  const atualizarAgendamento = (id: string, dados: Partial<AgendamentoDono>) => {
    setAgendamentos(agendamentos.map((a) => (a.id === id ? { ...a, ...dados } : a)));
  };

  const cancelarAgendamento = (id: string) => {
    atualizarAgendamento(id, { status: "cancelado" });
  };

  // Funções de profissional
  const adicionarProfissional = (profissional: Omit<ProfissionalDono, "id" | "dataAdmissao" | "avaliacaoMedia" | "totalAvaliacoes" | "faturamentoTotal" | "faltas">) => {
    const novo: ProfissionalDono = {
      id: Date.now().toString(),
      ...profissional,
      dataAdmissao: new Date().toISOString().split("T")[0],
      avaliacaoMedia: 0,
      totalAvaliacoes: 0,
      faturamentoTotal: 0,
      faltas: 0,
    };
    setProfissionais([...profissionais, novo]);
  };

  const atualizarProfissional = (id: string, dados: Partial<ProfissionalDono>) => {
    setProfissionais(profissionais.map((p) => (p.id === id ? { ...p, ...dados } : p)));
  };

  const removerProfissional = (id: string) => {
    setProfissionais(profissionais.filter((p) => p.id !== id));
  };

  // Funções de cliente
  const adicionarCliente = (cliente: Omit<ClienteDono, "id" | "dataCadastro" | "totalAgendamentos" | "ticketMedio" | "frequencia">) => {
    const novo: ClienteDono = {
      id: Date.now().toString(),
      ...cliente,
      dataCadastro: new Date().toISOString().split("T")[0],
      totalAgendamentos: 0,
      ticketMedio: 0,
      frequencia: 0,
    };
    setClientes([...clientes, novo]);
  };

  const atualizarCliente = (id: string, dados: Partial<ClienteDono>) => {
    setClientes(clientes.map((c) => (c.id === id ? { ...c, ...dados } : c)));
  };

  const marcarClienteVIP = (id: string, vip: boolean) => {
    atualizarCliente(id, { vip });
  };

  // Funções de pagamento
  const registrarPagamento = (pagamento: Omit<PagamentoDono, "id">) => {
    const novo: PagamentoDono = {
      id: Date.now().toString(),
      ...pagamento,
    };
    setPagamentos([...pagamentos, novo]);
  };

  // Funções de promoção
  const criarPromocao = (promocao: Omit<PromocaoDono, "id">) => {
    const novo: PromocaoDono = {
      id: Date.now().toString(),
      ...promocao,
    };
    setPromocoes([...promocoes, novo]);
  };

  const atualizarPromocao = (id: string, dados: Partial<PromocaoDono>) => {
    setPromocoes(promocoes.map((p) => (p.id === id ? { ...p, ...dados } : p)));
  };

  // Funções de avaliação
  const responderAvaliacao = (id: string, resposta: string) => {
    setAvaliacoes(avaliacoes.map((a) => (a.id === id ? { ...a, resposta } : a)));
  };

  // Funções de produto
  const adicionarProduto = (produto: Omit<ProdutoDono, "id">) => {
    const novo: ProdutoDono = {
      id: Date.now().toString(),
      ...produto,
    };
    setProdutos([...produtos, novo]);
  };

  const atualizarProduto = (id: string, dados: Partial<ProdutoDono>) => {
    setProdutos(produtos.map((p) => (p.id === id ? { ...p, ...dados } : p)));
  };

  const atualizarEstoque = (id: string, quantidade: number) => {
    atualizarProduto(id, { estoque: quantidade });
  };

  // Funções de notificação
  const marcarNotificacaoLida = (id: string) => {
    setNotificacoes(notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  };

  // Funções de configuração
  const atualizarConfiguracao = (dados: Partial<ConfiguracaoBarbearia>) => {
    setConfiguracao({ ...configuracao, ...dados });
  };

  // Funções de relatório
  const gerarRelatorio = (dataInicio: string, dataFim: string): RelatorioDono => {
    const agendamentosPeriodo = agendamentos.filter(
      (a) => a.data >= dataInicio && a.data <= dataFim
    );

    const faturamento = agendamentosPeriodo.reduce((sum, a) => sum + a.valor, 0);
    const cancelamentos = agendamentosPeriodo.filter((a) => a.status === "cancelado").length;

    return {
      periodo: `${dataInicio} a ${dataFim}`,
      faturamento,
      agendamentos: agendamentosPeriodo.length,
      cancelamentos,
      taxaCancelamento: agendamentosPeriodo.length > 0 ? (cancelamentos / agendamentosPeriodo.length) * 100 : 0,
      ticketMedio: agendamentosPeriodo.length > 0 ? faturamento / agendamentosPeriodo.length : 0,
      servicosMaisVendidos: [],
      profissionaisMaisRentaveis: [],
      horariosPico: [],
    };
  };

  return (
    <DonoContext.Provider
      value={{
        kpi,
        agendamentos,
        profissionais,
        clientes,
        pagamentos,
        promocoes,
        avaliacoes,
        produtos,
        notificacoes,
        configuracao,
        criarAgendamento,
        atualizarAgendamento,
        cancelarAgendamento,
        adicionarProfissional,
        atualizarProfissional,
        removerProfissional,
        adicionarCliente,
        atualizarCliente,
        marcarClienteVIP,
        registrarPagamento,
        criarPromocao,
        atualizarPromocao,
        responderAvaliacao,
        adicionarProduto,
        atualizarProduto,
        atualizarEstoque,
        marcarNotificacaoLida,
        atualizarConfiguracao,
        gerarRelatorio,
      }}
    >
      {children}
    </DonoContext.Provider>
  );
}

export function useDono() {
  const context = useContext(DonoContext);
  if (!context) {
    throw new Error("useDono deve ser usado dentro de DonoProvider");
  }
  return context;
}



