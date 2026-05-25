import { createContext, useContext, useState, ReactNode } from "react";
import {
  Notificacao,
  TemplateNotificacao,
  ConfiguracaoNotificacao,
  TipoNotificacao,
  CanalNotificacao,
} from "@/types/notificacao";

interface NotificacoesContextType {
  notificacoes: Notificacao[];
  templates: TemplateNotificacao[];
  configuracao: ConfiguracaoNotificacao;
  criarNotificacao: (notificacao: Omit<Notificacao, "id" | "dataCriacao">) => void;
  criarTemplate: (template: Omit<TemplateNotificacao, "id">) => void;
  atualizarConfiguracao: (config: Partial<ConfiguracaoNotificacao>) => void;
}

const NotificacoesContext = createContext<NotificacoesContextType | undefined>(undefined);

const notificacoesIniciais: Notificacao[] = [
  {
    id: "1",
    tipo: "pagamento",
    titulo: "Pagamento Atrasado",
    mensagem: "Sua assinatura está com pagamento atrasado. Regularize para continuar usando o sistema.",
    canais: ["email", "whatsapp"],
    destinatarios: ["1"],
    status: "enviada",
    dataEnvio: new Date(Date.now() - 3600000).toISOString(),
    dataCriacao: new Date(Date.now() - 3600000).toISOString(),
  },
];

const templatesIniciais: TemplateNotificacao[] = [
  {
    id: "1",
    nome: "Pagamento Atrasado",
    tipo: "pagamento",
    canal: "email",
    assunto: "Pagamento Atrasado - Ação Necessária",
    conteudo: "Olá {{nome}}, seu pagamento está atrasado. Valor: {{valor}}. Vencimento: {{vencimento}}.",
    variaveis: ["nome", "valor", "vencimento"],
    ativo: true,
  },
];

const configuracaoInicial: ConfiguracaoNotificacao = {
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@barbermaestro.com",
    smtpPassword: "",
    fromEmail: "noreply@barbermaestro.com",
    fromName: "Barber Maestro",
  },
  whatsapp: {
    provider: "twilio",
    apiKey: "",
    apiUrl: "https://api.twilio.com",
    numero: "+5511999999999",
  },
  sms: {
    provider: "twilio",
    apiKey: "",
    apiUrl: "https://api.twilio.com",
  },
};

export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesIniciais);
  const [templates, setTemplates] = useState<TemplateNotificacao[]>(templatesIniciais);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoNotificacao>(configuracaoInicial);

  const criarNotificacao = (notificacao: Omit<Notificacao, "id" | "dataCriacao">) => {
    const nova: Notificacao = {
      id: Date.now().toString(),
      ...notificacao,
      dataCriacao: new Date().toISOString(),
    };
    setNotificacoes([nova, ...notificacoes]);
  };

  const criarTemplate = (template: Omit<TemplateNotificacao, "id">) => {
    const novo: TemplateNotificacao = {
      id: Date.now().toString(),
      ...template,
    };
    setTemplates([...templates, novo]);
  };

  const atualizarConfiguracao = (config: Partial<ConfiguracaoNotificacao>) => {
    setConfiguracao({ ...configuracao, ...config });
  };

  return (
    <NotificacoesContext.Provider
      value={{
        notificacoes,
        templates,
        configuracao,
        criarNotificacao,
        criarTemplate,
        atualizarConfiguracao,
      }}
    >
      {children}
    </NotificacoesContext.Provider>
  );
}

export function useNotificacoes() {
  const context = useContext(NotificacoesContext);
  if (!context) {
    throw new Error("useNotificacoes deve ser usado dentro de NotificacoesProvider");
  }
  return context;
}







