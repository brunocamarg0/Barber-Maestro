import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import {
  Faturamento,
  MRR,
  TicketMedio,
  Churn,
  ChurnDetalhe,
  Comissao,
  ComissaoDetalhe,
  IntegracaoPagamento,
  GatewayPagamento,
  Webhook,
  FalhaCobranca,
  ReceitaPeriodo,
} from "@/types/financeiro";
import { usePlanos } from "./PlanosContext";
import { useBarbearias } from "./BarbeariasContext";

interface FinanceiroContextType {
  faturamento: Faturamento;
  mrr: MRR;
  ticketMedio: TicketMedio;
  churn: Churn;
  comissao: Comissao;
  integracoes: IntegracaoPagamento[];
  webhooks: Webhook[];
  falhasCobranca: FalhaCobranca[];
  receitaPeriodo: ReceitaPeriodo[];
  conectarGateway: (gateway: GatewayPagamento, config: Record<string, any>) => void;
  desconectarGateway: (gatewayId: string) => void;
  adicionarWebhook: (webhook: Omit<Webhook, "id">) => void;
  resolverFalhaCobranca: (falhaId: string, acao: string) => void;
  atualizarFaturamento: () => void;
}

const FinanceiroContext = createContext<FinanceiroContextType | undefined>(undefined);

// Integrações iniciais mockadas
const integracoesIniciais: IntegracaoPagamento[] = [
  {
    id: "1",
    gateway: "stripe",
    nome: "Stripe",
    conectado: true,
    dataConexao: "2024-01-15",
    chavePublica: "pk_test_...",
    webhookUrl: "https://api.groomguru.com/webhooks/stripe",
    configuracoes: {
      moeda: "BRL",
      modo: "test",
    },
  },
  {
    id: "2",
    gateway: "mercadopago",
    nome: "Mercado Pago",
    conectado: false,
    configuracoes: {},
  },
  {
    id: "3",
    gateway: "pagar_me",
    nome: "Pagar.me",
    conectado: false,
    configuracoes: {},
  },
  {
    id: "4",
    gateway: "asaas",
    nome: "Asaas",
    conectado: true,
    dataConexao: "2024-02-01",
    chavePublica: "asaas_...",
    webhookUrl: "https://api.groomguru.com/webhooks/asaas",
    configuracoes: {
      ambiente: "production",
    },
  },
];

// Webhooks iniciais mockados
const webhooksIniciais: Webhook[] = [
  {
    id: "1",
    gateway: "stripe",
    tipo: "payment.succeeded",
    status: "sucesso",
    data: new Date().toISOString(),
    payload: {
      id: "evt_123",
      type: "payment.succeeded",
      data: { object: { id: "ch_123", amount: 4990 } },
    },
    resposta: "Processado com sucesso",
  },
  {
    id: "2",
    gateway: "asaas",
    tipo: "payment.failed",
    status: "falha",
    data: new Date(Date.now() - 86400000).toISOString(),
    payload: {
      id: "evt_456",
      type: "payment.failed",
    },
    erro: "Cartão recusado",
  },
];

// Falhas de cobrança iniciais mockadas
const falhasCobrancaIniciais: FalhaCobranca[] = [
  {
    id: "1",
    assinaturaId: "sub_123",
    barbeariaId: "1",
    barbeariaNome: "Barbearia do João",
    valor: 99.9,
    dataVencimento: "2024-12-15",
    tentativas: 2,
    ultimaTentativa: "2024-12-16",
    status: "pendente",
    motivo: "Cartão expirado",
  },
  {
    id: "2",
    assinaturaId: "sub_456",
    barbeariaId: "2",
    barbeariaNome: "Corte & Estilo",
    valor: 49.9,
    dataVencimento: "2024-12-10",
    tentativas: 1,
    ultimaTentativa: "2024-12-11",
    status: "resolvida",
    motivo: "Saldo insuficiente",
    acao: "Pagamento realizado manualmente",
  },
];

export function FinanceiroProvider({ children }: { children: ReactNode }) {
  // Usar hooks diretamente - eles devem estar disponíveis pois o provider está dentro dos outros
  let assinaturas: any[] = [];
  let barbearias: any[] = [];
  
  try {
    const planosContext = usePlanos();
    assinaturas = planosContext.assinaturas || [];
  } catch (error) {
    console.warn("Erro ao acessar PlanosContext:", error);
  }
  
  try {
    const barbeariasContext = useBarbearias();
    barbearias = barbeariasContext.barbearias || [];
  } catch (error) {
    console.warn("Erro ao acessar BarbeariasContext:", error);
  }
  
  const [integracoes, setIntegracoes] = useState<IntegracaoPagamento[]>(integracoesIniciais);
  const [webhooks, setWebhooks] = useState<Webhook[]>(webhooksIniciais);
  const [falhasCobranca, setFalhasCobranca] = useState<FalhaCobranca[]>(falhasCobrancaIniciais);

  // Calcular faturamento
  const calcularFaturamento = (): Faturamento => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const assinaturasAtivas = assinaturas.filter(
      (a) => a.status === "em_dia" || a.status === "atrasado"
    );

    const receitaMensal = assinaturasAtivas.reduce(
      (total, assinatura) => total + assinatura.valorMensal,
      0
    );

    const receitaAnual = receitaMensal * 12;

    const receitaTotal = assinaturas.reduce(
      (total, assinatura) =>
        total + assinatura.pagamentos.filter((p) => p.status === "pago").reduce(
          (sum, pagamento) => sum + pagamento.valor,
          0
        ),
      0
    );

    return {
      total: receitaTotal,
      mensal: receitaMensal,
      anual: receitaAnual,
      periodo: `${mesAtual + 1}/${anoAtual}`,
    };
  };

  // Calcular MRR
  const calcularMRR = (): MRR => {
    const assinaturasAtivas = assinaturas.filter(
      (a) => a.status === "em_dia" || a.status === "atrasado"
    );

    const mrrAtual = assinaturasAtivas.reduce(
      (total, assinatura) => total + assinatura.valorMensal,
      0
    );

    // Simulação de crescimento (comparando com mês anterior)
    const crescimento = 12.5; // Mock

    return {
      valor: mrrAtual,
      crescimento,
      periodo: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    };
  };

  // Calcular ticket médio
  const calcularTicketMedio = (): TicketMedio => {
    const assinaturasAtivas = assinaturas.filter(
      (a) => a.status === "em_dia" || a.status === "atrasado"
    );

    if (assinaturasAtivas.length === 0) {
      return {
        valor: 0,
        crescimento: 0,
        periodo: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      };
    }

    const somaValores = assinaturasAtivas.reduce(
      (total, assinatura) => total + assinatura.valorMensal,
      0
    );

    const ticketMedio = somaValores / assinaturasAtivas.length;
    const crescimento = 5.2; // Mock

    return {
      valor: ticketMedio,
      crescimento,
      periodo: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    };
  };

  // Calcular churn
  const calcularChurn = (): Churn => {
    const cancelados = assinaturas.filter((a) => a.status === "cancelado");
    const totalAssinaturas = assinaturas.length;
    const assinaturasAtivas = assinaturas.filter(
      (a) => a.status === "em_dia" || a.status === "atrasado"
    ).length;

    const taxaChurn =
      totalAssinaturas > 0
        ? (cancelados.length / (assinaturasAtivas + cancelados.length)) * 100
        : 0;

    const detalhes: ChurnDetalhe[] = cancelados.map((assinatura) => {
      return {
        id: assinatura.id,
        barbeariaId: assinatura.barbeariaId,
        barbeariaNome: assinatura.barbeariaNome,
        dataCancelamento: assinatura.dataCancelamento || assinatura.dataVencimento,
        motivo: assinatura.motivoCancelamento,
        valorPerdido: assinatura.valorMensal,
      };
    });

    return {
      taxa: taxaChurn,
      quantidade: cancelados.length,
      periodo: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      detalhes,
    };
  };

  // Calcular comissões
  const calcularComissao = (): Comissao => {
    const faturamento = calcularFaturamento();
    const percentualComissao = 2.5; // Mock
    const totalComissao = (faturamento.mensal * percentualComissao) / 100;

    const integracoesConectadas = integracoes.filter((i) => i.conectado);
    const quantidadeConectadas = integracoesConectadas.length;

    const detalhes: ComissaoDetalhe[] = quantidadeConectadas > 0
      ? integracoesConectadas.map((integracao) => ({
          id: integracao.id,
          gateway: integracao.nome,
          valor: totalComissao / quantidadeConectadas,
          percentual: percentualComissao,
          data: new Date().toISOString().split("T")[0],
        }))
      : [];

    return {
      total: totalComissao,
      percentual: percentualComissao,
      periodo: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      detalhes,
    };
  };

  // Calcular receita por período
  const calcularReceitaPeriodo = (): ReceitaPeriodo[] => {
    const meses = [];
    const hoje = new Date();

    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mes = data.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });

      // Mock de dados
      const receita = Math.random() * 10000 + 5000;
      const assinaturasCount = Math.floor(Math.random() * 20 + 10);
      const novosClientes = Math.floor(Math.random() * 5 + 2);
      const cancelamentos = Math.floor(Math.random() * 3);

      meses.push({
        periodo: mes,
        receita,
        assinaturas: assinaturasCount,
        novosClientes,
        cancelamentos,
      });
    }

    return meses;
  };

  const conectarGateway = (gateway: GatewayPagamento, config: Record<string, any>) => {
    setIntegracoes(
      integracoes.map((i) =>
        i.gateway === gateway
          ? {
              ...i,
              conectado: true,
              dataConexao: new Date().toISOString().split("T")[0],
              ...config,
            }
          : i
      )
    );
  };

  const desconectarGateway = (gatewayId: string) => {
    setIntegracoes(
      integracoes.map((i) =>
        i.id === gatewayId
          ? {
              ...i,
              conectado: false,
              dataConexao: undefined,
              chavePublica: undefined,
              chavePrivada: undefined,
            }
          : i
      )
    );
  };

  const adicionarWebhook = (webhook: Omit<Webhook, "id">) => {
    const novoWebhook: Webhook = {
      id: Date.now().toString(),
      ...webhook,
    };
    setWebhooks([novoWebhook, ...webhooks]);
  };

  const resolverFalhaCobranca = (falhaId: string, acao: string) => {
    setFalhasCobranca(
      falhasCobranca.map((f) =>
        f.id === falhaId
          ? {
              ...f,
              status: "resolvida",
              acao,
            }
          : f
      )
    );
  };

  const atualizarFaturamento = () => {
    // Função para forçar atualização dos cálculos
    // Os valores são calculados dinamicamente
  };

  // Calcular valores usando useMemo para evitar recálculos desnecessários
  const faturamento = useMemo(() => calcularFaturamento(), [assinaturas]);
  const mrr = useMemo(() => calcularMRR(), [assinaturas]);
  const ticketMedio = useMemo(() => calcularTicketMedio(), [assinaturas]);
  const churn = useMemo(() => calcularChurn(), [assinaturas, barbearias]);
  const comissao = useMemo(() => calcularComissao(), [assinaturas, integracoes]);
  const receitaPeriodo = useMemo(() => calcularReceitaPeriodo(), []);

  return (
    <FinanceiroContext.Provider
      value={{
        faturamento,
        mrr,
        ticketMedio,
        churn,
        comissao,
        integracoes,
        webhooks,
        falhasCobranca,
        receitaPeriodo,
        conectarGateway,
        desconectarGateway,
        adicionarWebhook,
        resolverFalhaCobranca,
        atualizarFaturamento,
      }}
    >
      {children}
    </FinanceiroContext.Provider>
  );
}

export function useFinanceiro() {
  const context = useContext(FinanceiroContext);
  if (!context) {
    throw new Error("useFinanceiro deve ser usado dentro de FinanceiroProvider");
  }
  return context;
}

