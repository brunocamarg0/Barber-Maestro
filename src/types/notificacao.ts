export type TipoNotificacao = "automatica" | "manutencao" | "pagamento" | "bloqueio" | "sistema";

export type CanalNotificacao = "email" | "whatsapp" | "sms" | "interna";

export type StatusNotificacao = "pendente" | "enviada" | "falhou" | "cancelada";

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  canais: CanalNotificacao[];
  destinatarios: string[]; // IDs das barbearias ou "todos"
  status: StatusNotificacao;
  dataEnvio?: string;
  dataCriacao: string;
  templateId?: string;
}

export interface TemplateNotificacao {
  id: string;
  nome: string;
  tipo: TipoNotificacao;
  canal: CanalNotificacao;
  assunto?: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
}

export interface ConfiguracaoNotificacao {
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  whatsapp: {
    provider: string;
    apiKey: string;
    apiUrl: string;
    numero: string;
  };
  sms: {
    provider: string;
    apiKey: string;
    apiUrl: string;
  };
}



