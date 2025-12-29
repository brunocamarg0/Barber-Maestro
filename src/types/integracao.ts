export type TipoIntegracao = "whatsapp" | "sms" | "email" | "gateway" | "webhook";

export interface IntegracaoGlobal {
  id: string;
  tipo: TipoIntegracao;
  nome: string;
  provider: string;
  ativa: boolean;
  configuracoes: Record<string, any>;
  custos: {
    porUso: number;
    limiteMensal: number;
    usadoEsteMes: number;
  };
  templates: TemplateIntegracao[];
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface TemplateIntegracao {
  id: string;
  nome: string;
  tipo: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
}

export interface WebhookGlobal {
  id: string;
  nome: string;
  url: string;
  eventos: string[];
  ativo: boolean;
  secret?: string;
  ultimaChamada?: string;
  totalChamadas: number;
}

