export interface Faturamento {
  total: number;
  mensal: number;
  anual: number;
  periodo: string;
}

export interface MRR {
  valor: number;
  crescimento: number; // percentual
  periodo: string;
}

export interface TicketMedio {
  valor: number;
  crescimento: number; // percentual
  periodo: string;
}

export interface Churn {
  taxa: number; // percentual
  quantidade: number;
  periodo: string;
  detalhes: ChurnDetalhe[];
}

export interface ChurnDetalhe {
  id: string;
  barbeariaId: string;
  barbeariaNome: string;
  dataCancelamento: string;
  motivo?: string;
  valorPerdido: number;
}

export interface Comissao {
  total: number;
  percentual: number;
  periodo: string;
  detalhes: ComissaoDetalhe[];
}

export interface ComissaoDetalhe {
  id: string;
  gateway: string;
  valor: number;
  percentual: number;
  data: string;
}

export interface ReceitaPeriodo {
  periodo: string;
  receita: number;
  assinaturas: number;
  novosClientes: number;
  cancelamentos: number;
}

