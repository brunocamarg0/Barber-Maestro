import { createContext, useContext, useState, ReactNode } from "react";
import {
  IntegracaoGlobal,
  TemplateIntegracao,
  WebhookGlobal,
  TipoIntegracao,
} from "@/types/integracao";

interface IntegracoesGlobaisContextType {
  integracoes: IntegracaoGlobal[];
  webhooks: WebhookGlobal[];
  adicionarIntegracao: (integracao: Omit<IntegracaoGlobal, "id" | "dataCriacao">) => void;
  atualizarIntegracao: (id: string, dados: Partial<IntegracaoGlobal>) => void;
  adicionarWebhook: (webhook: Omit<WebhookGlobal, "id">) => void;
  atualizarWebhook: (id: string, dados: Partial<WebhookGlobal>) => void;
}

const IntegracoesGlobaisContext = createContext<IntegracoesGlobaisContextType | undefined>(
  undefined
);

const integracoesIniciais: IntegracaoGlobal[] = [
  {
    id: "1",
    tipo: "whatsapp",
    nome: "WhatsApp API",
    provider: "Twilio",
    ativa: true,
    configuracoes: {
      accountSid: "AC...",
      authToken: "...",
    },
    custos: {
      porUso: 0.05,
      limiteMensal: 10000,
      usadoEsteMes: 2500,
    },
    templates: [],
    dataCriacao: "2024-01-01",
  },
];

const webhooksIniciais: WebhookGlobal[] = [
  {
    id: "1",
    nome: "Webhook de Pagamentos",
    url: "https://api.groomguru.com/webhooks/pagamentos",
    eventos: ["pagamento.aprovado", "pagamento.recusado"],
    ativo: true,
    totalChamadas: 150,
    ultimaChamada: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function IntegracoesGlobaisProvider({ children }: { children: ReactNode }) {
  const [integracoes, setIntegracoes] = useState<IntegracaoGlobal[]>(integracoesIniciais);
  const [webhooks, setWebhooks] = useState<WebhookGlobal[]>(webhooksIniciais);

  const adicionarIntegracao = (integracao: Omit<IntegracaoGlobal, "id" | "dataCriacao">) => {
    const nova: IntegracaoGlobal = {
      id: Date.now().toString(),
      ...integracao,
      dataCriacao: new Date().toISOString().split("T")[0],
    };
    setIntegracoes([...integracoes, nova]);
  };

  const atualizarIntegracao = (id: string, dados: Partial<IntegracaoGlobal>) => {
    setIntegracoes(
      integracoes.map((i) =>
        i.id === id ? { ...i, ...dados, dataAtualizacao: new Date().toISOString().split("T")[0] } : i
      )
    );
  };

  const adicionarWebhook = (webhook: Omit<WebhookGlobal, "id">) => {
    const novo: WebhookGlobal = {
      id: Date.now().toString(),
      ...webhook,
      totalChamadas: 0,
    };
    setWebhooks([...webhooks, novo]);
  };

  const atualizarWebhook = (id: string, dados: Partial<WebhookGlobal>) => {
    setWebhooks(webhooks.map((w) => (w.id === id ? { ...w, ...dados } : w)));
  };

  return (
    <IntegracoesGlobaisContext.Provider
      value={{
        integracoes,
        webhooks,
        adicionarIntegracao,
        atualizarIntegracao,
        adicionarWebhook,
        atualizarWebhook,
      }}
    >
      {children}
    </IntegracoesGlobaisContext.Provider>
  );
}

export function useIntegracoesGlobais() {
  const context = useContext(IntegracoesGlobaisContext);
  if (!context) {
    throw new Error("useIntegracoesGlobais deve ser usado dentro de IntegracoesGlobaisProvider");
  }
  return context;
}

