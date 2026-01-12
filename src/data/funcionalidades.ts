import { 
  Calendar, 
  CreditCard, 
  Users, 
  BarChart3, 
  Bell, 
  Shield, 
  Scissors,
  UserCog,
  Store,
  FileText,
  Settings,
  MessageSquare,
  Package,
  Star,
  TrendingUp,
  Lock,
  HeadphonesIcon,
  Zap,
  ClipboardList,
  Wallet,
  Gift,
  Mail,
  Smartphone
} from "lucide-react";

export interface Funcionalidade {
  id: string;
  icon: any;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'admin' | 'dono' | 'cliente' | 'geral';
  route?: string;
  features: string[];
}

export const funcionalidades: Funcionalidade[] = [
  {
    id: 'agendamento-online',
    icon: Calendar,
    title: 'Agendamento Online',
    shortDescription: 'Sistema intuitivo de agendamentos que seus clientes vão adorar. Confirmações automáticas e lembretes.',
    fullDescription: 'Sistema completo de agendamento online que permite aos clientes agendar serviços 24/7. Inclui confirmações automáticas, lembretes por SMS e WhatsApp, gestão de horários disponíveis, bloqueio de horários e integração com calendário do profissional.',
    category: 'geral',
    route: '/cliente/agendar',
    features: [
      'Agendamento 24/7 pelos clientes',
      'Confirmações automáticas',
      'Lembretes por SMS e WhatsApp',
      'Gestão de horários disponíveis',
      'Bloqueio de horários',
      'Integração com calendário'
    ]
  },
  {
    id: 'pagamentos-integrados',
    icon: CreditCard,
    title: 'Pagamentos Integrados',
    shortDescription: 'Aceite pagamentos online e presenciais. Controle financeiro completo e automático.',
    fullDescription: 'Sistema de pagamentos completo que aceita múltiplas formas de pagamento: cartão de crédito, débito, PIX, dinheiro e outros. Inclui controle financeiro automático, relatórios de receita, gestão de comissões e integração com gateways de pagamento.',
    category: 'geral',
    route: '/cliente/pagamentos',
    features: [
      'Múltiplas formas de pagamento',
      'Pagamento online e presencial',
      'Controle financeiro automático',
      'Relatórios de receita',
      'Gestão de comissões',
      'Integração com gateways'
    ]
  },
  {
    id: 'gestao-clientes',
    icon: Users,
    title: 'Gestão de Clientes',
    shortDescription: 'Cadastro completo de clientes, histórico de serviços e preferências personalizadas.',
    fullDescription: 'Sistema completo de gestão de clientes que permite cadastro detalhado, histórico completo de serviços realizados, preferências pessoais, aniversários, fidelidade e comunicação direta. Ideal para criar relacionamentos duradouros.',
    category: 'dono',
    route: '/dono/clientes',
    features: [
      'Cadastro completo de clientes',
      'Histórico de serviços',
      'Preferências personalizadas',
      'Controle de aniversários',
      'Programa de fidelidade',
      'Comunicação direta'
    ]
  },
  {
    id: 'relatorios-detalhados',
    icon: BarChart3,
    title: 'Relatórios Detalhados',
    shortDescription: 'Análise de desempenho, faturamento e insights para crescer seu negócio.',
    fullDescription: 'Relatórios avançados e análises detalhadas do seu negócio. Inclui relatórios de faturamento, desempenho de profissionais, serviços mais vendidos, análise de clientes, previsões e insights para tomada de decisão estratégica.',
    category: 'dono',
    route: '/dono/relatorios',
    features: [
      'Relatórios de faturamento',
      'Desempenho de profissionais',
      'Serviços mais vendidos',
      'Análise de clientes',
      'Previsões e tendências',
      'Insights estratégicos'
    ]
  },
  {
    id: 'notificacoes-automaticas',
    icon: Bell,
    title: 'Notificações Automáticas',
    shortDescription: 'SMS e WhatsApp automatizados para lembretes e confirmações de agendamentos.',
    fullDescription: 'Sistema de notificações automáticas que envia lembretes de agendamentos, confirmações, promoções e comunicados importantes via SMS, WhatsApp e email. Reduz no-shows e melhora a comunicação com os clientes.',
    category: 'geral',
    features: [
      'Lembretes automáticos',
      'Confirmações de agendamento',
      'Notificações por SMS',
      'Notificações por WhatsApp',
      'Notificações por email',
      'Comunicação personalizada'
    ]
  },
  {
    id: 'seguranca-total',
    icon: Shield,
    title: 'Segurança Total',
    shortDescription: 'Seus dados e dos seus clientes protegidos com criptografia de ponta.',
    fullDescription: 'Sistema de segurança robusto com criptografia de ponta, backup automático, controle de acesso por permissões, auditoria de ações, conformidade com LGPD e proteção contra fraudes. Seus dados estão sempre seguros.',
    category: 'geral',
    features: [
      'Criptografia de ponta',
      'Backup automático',
      'Controle de acesso',
      'Auditoria de ações',
      'Conformidade LGPD',
      'Proteção contra fraudes'
    ]
  },
  {
    id: 'gestao-servicos',
    icon: Scissors,
    title: 'Gestão de Serviços',
    shortDescription: 'Cadastre e gerencie todos os serviços oferecidos pela sua barbearia.',
    fullDescription: 'Sistema completo para cadastrar, editar e gerenciar todos os serviços oferecidos. Defina preços, duração, profissionais responsáveis, categorias e muito mais. Facilita a organização e apresentação dos serviços aos clientes.',
    category: 'dono',
    route: '/dono/servicos',
    features: [
      'Cadastro de serviços',
      'Definição de preços',
      'Controle de duração',
      'Atribuição de profissionais',
      'Categorização',
      'Gestão completa'
    ]
  },
  {
    id: 'gestao-profissionais',
    icon: UserCog,
    title: 'Gestão de Profissionais',
    shortDescription: 'Gerencie sua equipe, horários, comissões e desempenho de cada profissional.',
    fullDescription: 'Sistema completo para gerenciar sua equipe de profissionais. Controle de horários, comissões, desempenho individual, avaliações, especialidades e muito mais. Ideal para otimizar a produtividade da equipe.',
    category: 'dono',
    route: '/dono/profissionais',
    features: [
      'Gestão de equipe',
      'Controle de horários',
      'Gestão de comissões',
      'Avaliação de desempenho',
      'Especialidades',
      'Relatórios individuais'
    ]
  },
  {
    id: 'agenda-inteligente',
    icon: Calendar,
    title: 'Agenda Inteligente',
    shortDescription: 'Agenda completa com visualização por dia, semana e mês. Otimização automática.',
    fullDescription: 'Agenda inteligente que permite visualizar todos os agendamentos de forma clara e organizada. Visualização por dia, semana e mês, otimização automática de horários, gestão de bloqueios e muito mais.',
    category: 'dono',
    route: '/dono/agenda',
    features: [
      'Visualização por dia/semana/mês',
      'Otimização automática',
      'Gestão de bloqueios',
      'Múltiplos profissionais',
      'Sincronização em tempo real',
      'Interface intuitiva'
    ]
  },
  {
    id: 'fidelidade-promocoes',
    icon: Gift,
    title: 'Programa de Fidelidade',
    shortDescription: 'Crie programas de fidelidade e promoções para reter e atrair clientes.',
    fullDescription: 'Sistema completo de fidelidade e promoções. Crie programas de pontos, descontos progressivos, cupons de desconto, promoções sazonais e campanhas personalizadas para aumentar a retenção de clientes.',
    category: 'dono',
    route: '/dono/fidelidade',
    features: [
      'Programa de pontos',
      'Descontos progressivos',
      'Cupons de desconto',
      'Promoções sazonais',
      'Campanhas personalizadas',
      'Relatórios de engajamento'
    ]
  },
  {
    id: 'avaliacoes-reputacao',
    icon: Star,
    title: 'Avaliações e Reputação',
    shortDescription: 'Sistema de avaliações que ajuda a construir e manter sua reputação online.',
    fullDescription: 'Sistema de avaliações completo que permite aos clientes avaliar serviços e profissionais. Gerencie avaliações, responda comentários, monitore sua reputação e use feedback para melhorar continuamente seus serviços.',
    category: 'dono',
    route: '/dono/avaliacoes',
    features: [
      'Avaliações de serviços',
      'Avaliações de profissionais',
      'Gestão de comentários',
      'Monitoramento de reputação',
      'Feedback para melhorias',
      'Integração com redes sociais'
    ]
  },
  {
    id: 'produtos-estoque',
    icon: Package,
    title: 'Produtos e Estoque',
    shortDescription: 'Controle completo de produtos, estoque e vendas de produtos da barbearia.',
    fullDescription: 'Sistema de gestão de produtos e estoque completo. Controle de entrada e saída, alertas de estoque baixo, gestão de fornecedores, vendas de produtos, relatórios de movimentação e muito mais.',
    category: 'dono',
    route: '/dono/produtos',
    features: [
      'Controle de estoque',
      'Alertas de estoque baixo',
      'Gestão de fornecedores',
      'Vendas de produtos',
      'Relatórios de movimentação',
      'Controle de custos'
    ]
  },
  {
    id: 'financeiro-pagamentos',
    icon: Wallet,
    title: 'Financeiro e Pagamentos',
    shortDescription: 'Controle financeiro completo com relatórios, comissões e gestão de receitas.',
    fullDescription: 'Sistema financeiro completo para gerenciar todas as receitas, despesas, comissões e relatórios financeiros. Inclui controle de caixa, conciliação bancária, relatórios de lucratividade e muito mais.',
    category: 'dono',
    route: '/dono/financeiro',
    features: [
      'Controle de receitas e despesas',
      'Gestão de comissões',
      'Relatórios financeiros',
      'Controle de caixa',
      'Conciliação bancária',
      'Análise de lucratividade'
    ]
  },
  {
    id: 'historico-agendamentos',
    icon: ClipboardList,
    title: 'Histórico de Agendamentos',
    shortDescription: 'Acompanhe todo o histórico de agendamentos e serviços realizados.',
    fullDescription: 'Visualize e gerencie todo o histórico de agendamentos dos clientes. Inclui filtros avançados, busca por data, cliente ou serviço, exportação de relatórios e análise de padrões de agendamento.',
    category: 'cliente',
    route: '/cliente/historico',
    features: [
      'Histórico completo',
      'Filtros avançados',
      'Busca por data/cliente/serviço',
      'Exportação de relatórios',
      'Análise de padrões',
      'Visualização detalhada'
    ]
  },
  {
    id: 'perfil-cliente',
    icon: Users,
    title: 'Perfil do Cliente',
    shortDescription: 'Gerencie seu perfil, preferências e informações pessoais.',
    fullDescription: 'Área do cliente completa para gerenciar perfil, atualizar informações pessoais, definir preferências de serviços, histórico pessoal e muito mais. Total controle sobre suas informações.',
    category: 'cliente',
    route: '/cliente/perfil',
    features: [
      'Gestão de perfil',
      'Atualização de informações',
      'Preferências de serviços',
      'Histórico pessoal',
      'Configurações de privacidade',
      'Controle total'
    ]
  },
  {
    id: 'configuracoes-barbearia',
    icon: Settings,
    title: 'Configurações da Barbearia',
    shortDescription: 'Configure todas as opções e preferências da sua barbearia.',
    fullDescription: 'Painel completo de configurações para personalizar sua barbearia. Configure horários de funcionamento, formas de pagamento aceitas, políticas, integrações, notificações e muito mais.',
    category: 'dono',
    route: '/dono/configuracoes',
    features: [
      'Horários de funcionamento',
      'Formas de pagamento',
      'Políticas e termos',
      'Integrações',
      'Configurações de notificações',
      'Personalização completa'
    ]
  },
  {
    id: 'suporte-cliente',
    icon: HeadphonesIcon,
    title: 'Suporte ao Cliente',
    shortDescription: 'Canal direto de comunicação e suporte para seus clientes.',
    fullDescription: 'Sistema de suporte completo que permite aos clientes abrirem chamados, fazerem perguntas frequentes, acessarem tutoriais e receberem ajuda rápida. Melhora a experiência do cliente e reduz carga de trabalho.',
    category: 'cliente',
    route: '/cliente/suporte',
    features: [
      'Abertura de chamados',
      'Perguntas frequentes',
      'Tutoriais e guias',
      'Chat de suporte',
      'Histórico de atendimentos',
      'Respostas rápidas'
    ]
  },
  {
    id: 'admin-barbearias',
    icon: Store,
    title: 'Administração de Barbearias',
    shortDescription: 'Painel administrativo completo para gerenciar todas as barbearias do sistema.',
    fullDescription: 'Painel administrativo completo para gerenciar todas as barbearias cadastradas no sistema. Inclui criação, edição, ativação/desativação, visualização de detalhes, gestão de serviços e muito mais.',
    category: 'admin',
    route: '/admin/barbearias',
    features: [
      'Cadastro de barbearias',
      'Edição de informações',
      'Ativação/desativação',
      'Visualização de detalhes',
      'Gestão de serviços',
      'Controle total'
    ]
  },
  {
    id: 'admin-planos',
    icon: FileText,
    title: 'Gestão de Planos',
    shortDescription: 'Crie e gerencie planos de assinatura para as barbearias.',
    fullDescription: 'Sistema completo para criar, editar e gerenciar planos de assinatura. Defina recursos, preços, limites, períodos de teste e muito mais. Ideal para oferecer diferentes níveis de serviço.',
    category: 'admin',
    route: '/admin/planos',
    features: [
      'Criação de planos',
      'Definição de recursos',
      'Gestão de preços',
      'Limites e restrições',
      'Períodos de teste',
      'Gestão de assinaturas'
    ]
  },
  {
    id: 'admin-usuarios',
    icon: Users,
    title: 'Gestão de Usuários',
    shortDescription: 'Gerencie todos os usuários do sistema, permissões e acessos.',
    fullDescription: 'Sistema completo de gestão de usuários. Crie, edite, ative e desative usuários, gerencie permissões, roles, acessos e muito mais. Controle total sobre quem pode acessar o sistema.',
    category: 'admin',
    route: '/admin/usuarios',
    features: [
      'Criação de usuários',
      'Gestão de permissões',
      'Controle de roles',
      'Ativação/desativação',
      'Histórico de acessos',
      'Segurança avançada'
    ]
  },
  {
    id: 'admin-financeiro',
    icon: TrendingUp,
    title: 'Dashboard Financeiro',
    shortDescription: 'Visão completa do financeiro de todas as barbearias e do sistema.',
    fullDescription: 'Dashboard financeiro completo com visão geral de receitas, despesas, assinaturas ativas, comissões e muito mais. Relatórios consolidados e análises detalhadas para tomada de decisão.',
    category: 'admin',
    route: '/admin/financeiro',
    features: [
      'Visão geral financeira',
      'Relatórios consolidados',
      'Análise de assinaturas',
      'Controle de receitas',
      'Métricas e KPIs',
      'Exportação de dados'
    ]
  },
  {
    id: 'admin-monitoramento',
    icon: Zap,
    title: 'Monitoramento do Sistema',
    shortDescription: 'Monitore o desempenho, saúde e uso do sistema em tempo real.',
    fullDescription: 'Sistema de monitoramento completo que acompanha o desempenho, saúde, uso e disponibilidade do sistema. Alertas automáticos, métricas em tempo real e relatórios de performance.',
    category: 'admin',
    route: '/admin/monitoramento',
    features: [
      'Monitoramento em tempo real',
      'Métricas de performance',
      'Alertas automáticos',
      'Análise de uso',
      'Relatórios de saúde',
      'Dashboard de métricas'
    ]
  },
  {
    id: 'integracoes-globais',
    icon: Smartphone,
    title: 'Integrações Globais',
    shortDescription: 'Integre com sistemas externos, APIs e serviços de terceiros.',
    fullDescription: 'Sistema de integrações completo que permite conectar com sistemas externos, APIs, serviços de pagamento, redes sociais, marketing e muito mais. Expanda as capacidades do seu sistema.',
    category: 'admin',
    route: '/admin/integracoes-globais',
    features: [
      'Integração com APIs',
      'Gateways de pagamento',
      'Redes sociais',
      'Ferramentas de marketing',
      'Sistemas externos',
      'Webhooks e eventos'
    ]
  }
];
