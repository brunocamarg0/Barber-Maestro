// Catálogo único de features do sistema.
// Fonte da verdade: cada feature tem um ID estável usado no banco
// (coluna planos.recursos text[]) e em <FeatureGate feature="..." />.

export type PlanoSlug = "basico" | "premium" | "enterprise";

export interface FeatureDef {
  id: string;
  nome: string;
  descricao: string;
  planos: PlanoSlug[]; // planos que incluem essa feature por padrão
}

export const FEATURES: Record<string, FeatureDef> = {
  // === BÁSICO ===
  agenda: {
    id: "agenda",
    nome: "Agenda e Calendário",
    descricao: "Visualização e gestão de agendamentos",
    planos: ["basico", "premium", "enterprise"],
  },
  clientes: {
    id: "clientes",
    nome: "Cadastro de Clientes",
    descricao: "Gestão da base de clientes",
    planos: ["basico", "premium", "enterprise"],
  },
  servicos: {
    id: "servicos",
    nome: "Cadastro de Serviços",
    descricao: "Catálogo de serviços oferecidos",
    planos: ["basico", "premium", "enterprise"],
  },
  link_publico: {
    id: "link_publico",
    nome: "Link Público de Agendamento",
    descricao: "Página pública para clientes agendarem",
    planos: ["basico", "premium", "enterprise"],
  },
  relatorios_basicos: {
    id: "relatorios_basicos",
    nome: "Relatórios Básicos",
    descricao: "Faturamento do dia/semana/mês",
    planos: ["basico", "premium", "enterprise"],
  },
  pagamento_manual: {
    id: "pagamento_manual",
    nome: "Pagamento Manual",
    descricao: "Registro de pagamentos em dinheiro/PIX manual",
    planos: ["basico", "premium", "enterprise"],
  },

  // === PREMIUM ===
  multi_profissionais: {
    id: "multi_profissionais",
    nome: "Múltiplos Profissionais",
    descricao: "Mais de um profissional na barbearia",
    planos: ["premium", "enterprise"],
  },
  comissoes: {
    id: "comissoes",
    nome: "Comissões",
    descricao: "Cálculo e pagamento de comissões",
    planos: ["premium", "enterprise"],
  },
  mercadopago_connect: {
    id: "mercadopago_connect",
    nome: "Mercado Pago Connect",
    descricao: "Recebimento automático via PIX/cartão",
    planos: ["premium", "enterprise"],
  },
  whatsapp: {
    id: "whatsapp",
    nome: "Integração WhatsApp",
    descricao: "Lembretes e confirmações automáticas",
    planos: ["premium", "enterprise"],
  },
  promocoes: {
    id: "promocoes",
    nome: "Promoções e Cupons",
    descricao: "Campanhas e cupons de desconto",
    planos: ["premium", "enterprise"],
  },
  fidelidade: {
    id: "fidelidade",
    nome: "Programa de Fidelidade",
    descricao: "Pontos e cashback para clientes",
    planos: ["premium", "enterprise"],
  },
  avaliacoes: {
    id: "avaliacoes",
    nome: "Avaliações",
    descricao: "Notas e comentários dos clientes",
    planos: ["premium", "enterprise"],
  },
  estoque: {
    id: "estoque",
    nome: "Controle de Estoque",
    descricao: "Gestão de produtos e estoque",
    planos: ["premium", "enterprise"],
  },
  relatorios_avancados: {
    id: "relatorios_avancados",
    nome: "Relatórios Avançados",
    descricao: "Comissões, retenção e ticket médio",
    planos: ["premium", "enterprise"],
  },
  planos_cliente: {
    id: "planos_cliente",
    nome: "Planos de Assinatura para Clientes",
    descricao: "Mensalidade do cliente final",
    planos: ["premium", "enterprise"],
  },

  // === ENTERPRISE ===
  multi_unidade: {
    id: "multi_unidade",
    nome: "Multi-unidade",
    descricao: "Várias barbearias na mesma conta",
    planos: ["enterprise"],
  },
  relatorios_consolidados: {
    id: "relatorios_consolidados",
    nome: "Relatórios Consolidados",
    descricao: "Visão agregada entre unidades",
    planos: ["enterprise"],
  },
  api_integracoes: {
    id: "api_integracoes",
    nome: "API e Integrações",
    descricao: "Integrações personalizadas",
    planos: ["enterprise"],
  },
  suporte_prioritario: {
    id: "suporte_prioritario",
    nome: "Suporte Prioritário",
    descricao: "Atendimento dedicado",
    planos: ["enterprise"],
  },
  marca_branca: {
    id: "marca_branca",
    nome: "Marca Branca",
    descricao: "Logo e cores customizadas",
    planos: ["enterprise"],
  },
  exportacao_avancada: {
    id: "exportacao_avancada",
    nome: "Exportação Avançada",
    descricao: "CSV/Excel de todos os dados",
    planos: ["enterprise"],
  },
} as const;

export const PLANOS_LABEL: Record<PlanoSlug, string> = {
  basico: "Básico",
  premium: "Profissional",
  enterprise: "Enterprise",
};

export function planoMinimoPara(featureId: string): PlanoSlug | null {
  const f = FEATURES[featureId];
  if (!f) return null;
  if (f.planos.includes("basico")) return "basico";
  if (f.planos.includes("premium")) return "premium";
  return "enterprise";
}
