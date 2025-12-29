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

export type GatewayPagamento = "stripe" | "mercadopago" | "pagar_me" | "asaas";

export interface IntegracaoPagamento {
  id: string;
  gateway: GatewayPagamento;
  nome: string;
  conectado: boolean;
  dataConexao?: string;
  chavePublica?: string;
  chavePrivada?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  configuracoes: Record<string, any>;
}

export interface Webhook {
  id: string;
  gateway: GatewayPagamento;
  tipo: string;
  status: "sucesso" | "falha" | "pendente";
  data: string;
  payload: Record<string, any>;
  resposta?: string;
  erro?: string;
}

export interface FalhaCobranca {
  id: string;
  assinaturaId: string;
  barbeariaId: string;
  barbeariaNome: string;
  valor: number;
  dataVencimento: string;
  tentativas: number;
  ultimaTentativa: string;
  status: "pendente" | "resolvida" | "cancelada";
  motivo?: string;
  acao?: string;
}

export interface ReceitaPeriodo {
  periodo: string;
  receita: number;
  assinaturas: number;
  novosClientes: number;
  cancelamentos: number;
}

