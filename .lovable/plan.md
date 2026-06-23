# Migração Painel Admin (dark monochrome red) + Cliente Dashboard

Escopo grande — proponho dividir em **3 fases entregáveis**. Você confirma e eu executo fase por fase (cada fase é um turno).

---

## Fase 1 — Visual (rápida, baixo risco)

**Objetivo:** Painel Admin e Dashboard do Cliente com a mesma identidade da landing/login (`#0a0a0a` bg, glow vermelho `#dc2626`, grid pattern, corner accents, Bebas Neue uppercase, cards `border-white/10 bg-black/40`).

Arquivos:
- `src/pages/admin/AdminLayout.tsx` — sidebar preta, header com glow vermelho, logo Bebas Neue, item ativo com borda esquerda vermelha
- `src/pages/admin/LoginAdmin.tsx` — mesmo padrão das telas de login
- `src/pages/admin/AdminDashboard.tsx` + `SuperAdminDashboard.tsx` — KPIs em cards escuros, tabela de barbearias com bordas `white/10`
- `src/pages/cliente/ClienteDashboard.tsx` — hero "Olá, {nome}", card "Próximo agendamento" com glow vermelho, atalhos em grid bento, fidelidade com barra de progresso

Tema do painel cliente continua respeitando a memória (light no resto), mas o Dashboard ganha header escuro/destaque vermelho coerente com o ClienteLayout que já foi migrado.

---

## Fase 2 — Visual das demais páginas do Admin

Reaplicar tokens nos cards/tabelas/formulários sem mudar lógica:
- `Planos.tsx`, `Assinaturas.tsx`, `DetalhesAssinatura.tsx`
- `FinanceiroDashboard.tsx`
- `Usuarios.tsx`, `Monitoramento.tsx`, `Notificacoes.tsx`
- `IntegracoesGlobais.tsx`, `Seguranca.tsx`, `Suporte.tsx`, `Configuracoes.tsx`
- `CadastrarBarbearia.tsx`, `EditarBarbearia.tsx`, `DetalhesBarbearia.tsx`, `ServicosBarbearia.tsx`

---

## Fase 3 — Funcionalidades do Admin (a parte pesada)

Hoje vários módulos do admin usam `src/services/adminApi.ts` apontando para o backend Express legado (`backend/`), que está sendo descontinuado (memória `lovable-cloud-migration`). Para o painel ficar **funcional de verdade no Lovable Cloud** precisamos migrar:

**3a. Autenticação Admin real**
- Hoje `AdminLayout` permite acesso livre (`handleLogout` só navega). Trocar por `ProtectedRoute requireRole="super_admin"` usando `useAuth` + tabela `user_roles`.

**3b. Financeiro / Pagamentos (prioridade do usuário)**
- Substituir `FinanceiroDashboard` mockado por leitura direta das tabelas `pagamentos_assinatura`, `faturas`, `assinaturas` via Supabase client.
- KPIs: MRR, churn, inadimplência, ticket médio (queries SQL agregadas em RPC `get_admin_financeiro_kpis`).
- Lista de transações com filtro por período + export CSV.
- Ação "marcar como paga manualmente" + reembolso via Mercado Pago (edge function `mercadopago-refund` nova).

**3c. Gestão de Barbearias**
- `AdminDashboard` lendo `barbearias` + join `assinaturas` direto do Cloud.
- Suspender/reativar barbearia (update `status`) com policy `super_admin`.
- Tela de detalhes mostrando assinatura, último pagamento, dono, profissionais, métricas.

**3d. Planos e Assinaturas**
- CRUD de `planos` (já existe tabela) via Supabase.
- Lista de `assinaturas` com status MP, próximo vencimento, ação de cancelar.

**3e. Usuários e Papéis**
- Listar `auth.users` (via RPC security-definer) + `user_roles`.
- Promover/rebaixar papel (`super_admin` only).

**3f. Solicitações de Cadastro**
- Tela para aprovar/rejeitar `solicitacoes_cadastro` (cria barbearia + role owner + envia email).

**3g. Suporte e Notificações**
- `tickets_suporte`: listar, responder, fechar.
- `notificacoes`: broadcast para barbearias.

---

## Como vamos tocar

1. Eu executo **Fase 1 agora** (1 turno).
2. Você valida visualmente.
3. Sigo Fase 2 (1 turno).
4. Fase 3 vai em sub-turnos por módulo, começando por **Auth Admin + Financeiro** (que você priorizou).

---

## Detalhes técnicos

- Não vou tocar `backend/` nem `api/` — serão removidos no fim da migração (já marcado na memória).
- Novas RPCs (`get_admin_financeiro_kpis`, listar usuários, etc.) entram como migrations com `security definer` + check `has_role(auth.uid(), 'super_admin')`.
- Edge function `mercadopago-refund` reusa secret `MERCADOPAGO_ACCESS_TOKEN` (token global, ok para refund do admin).
- Mantemos tokens semânticos em `index.css`; nada de cor hardcoded fora dos componentes de "moldura" (glow/grid) que já seguem o padrão das telas migradas.

Confirma esse plano? Se sim, começo pela **Fase 1** já no próximo turno.
