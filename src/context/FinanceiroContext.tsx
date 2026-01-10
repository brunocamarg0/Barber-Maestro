import React, { createContext, useContext, useMemo, ReactNode } from "react";
import {
  Faturamento,
  MRR,
  TicketMedio,
  Churn,
  ChurnDetalhe,
  Comissao,
  ComissaoDetalhe,
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
  receitaPeriodo: ReceitaPeriodo[];
}

const FinanceiroContext = createContext<FinanceiroContextType | undefined>(undefined);

export function FinanceiroProvider({ children }: { children: ReactNode }) {
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

    const detalhes: ComissaoDetalhe[] = [
      {
        id: "1",
        gateway: "Stripe",
        valor: totalComissao * 0.4,
        percentual: percentualComissao,
        data: new Date().toISOString().split("T")[0],
      },
      {
        id: "2",
        gateway: "Mercado Pago",
        valor: totalComissao * 0.35,
        percentual: percentualComissao,
        data: new Date().toISOString().split("T")[0],
      },
      {
        id: "3",
        gateway: "Asaas",
        valor: totalComissao * 0.25,
        percentual: percentualComissao,
        data: new Date().toISOString().split("T")[0],
      },
    ];

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

      // Mock de dados baseado nas assinaturas
      const baseReceita = assinaturas.filter((a) => a.status === "em_dia" || a.status === "atrasado")
        .reduce((sum, a) => sum + a.valorMensal, 0);
      
      const receita = baseReceita * (0.9 + Math.random() * 0.2); // Variação de 90-110%
      const assinaturasCount = Math.floor(assinaturas.length * (0.8 + Math.random() * 0.4));
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

  // Calcular valores usando useMemo para evitar recálculos desnecessários
  const faturamento = useMemo(() => calcularFaturamento(), [assinaturas]);
  const mrr = useMemo(() => calcularMRR(), [assinaturas]);
  const ticketMedio = useMemo(() => calcularTicketMedio(), [assinaturas]);
  const churn = useMemo(() => calcularChurn(), [assinaturas, barbearias]);
  const comissao = useMemo(() => calcularComissao(), [assinaturas]);
  const receitaPeriodo = useMemo(() => calcularReceitaPeriodo(), [assinaturas]);

  return (
    <FinanceiroContext.Provider
      value={{
        faturamento,
        mrr,
        ticketMedio,
        churn,
        comissao,
        receitaPeriodo,
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



