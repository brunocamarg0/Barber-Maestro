## Proposta: Controle de Features por Plano

### Resumo dos 3 planos

**BÁSICO** — R$ 49,90/mês — barbeiro autônomo / começando
- Até **1 profissional** + **100 agendamentos/mês**
- Agenda e calendário
- Cadastro de clientes
- Cadastro de serviços
- Link público de agendamento
- Relatórios básicos (faturamento do dia/semana)
- Pagamento dinheiro/PIX manual

**PROFISSIONAL (Premium)** — R$ 99,90/mês — barbearia em crescimento
- Tudo do Básico +
- Até **5 profissionais** + **1.000 agendamentos/mês**
- **Múltiplos profissionais** com comissões
- **Mercado Pago Connect** (PIX automático no checkout)
- **WhatsApp** (lembretes e confirmação)
- **Promoções e cupons**
- **Fidelidade** (pontos/cashback)
- **Avaliações** dos clientes
- **Controle de estoque/produtos**
- **Relatórios avançados** (comissões, ticket médio, retenção)
- **Planos de assinatura para clientes** (mensalidade do cliente final)

**ENTERPRISE** — R$ 199,90/mês — rede / múltiplas unidades
- Tudo do Premium +
- Profissionais e agendamentos **ilimitados**
- **Multi-unidade** (várias barbearias na mesma conta)
- **Relatórios consolidados** entre unidades
- **API/Integrações personalizadas**
- **Suporte prioritário** (chat dedicado)
- **Marca branca** (logo/cores customizadas no link público)
- **Exportação avançada** (CSV/Excel de tudo)

### Como vai funcionar tecnicamente

**1. Catálogo de features** (`src/config/features.ts`)
Lista única com ID estável de cada feature, label, descrição e quais planos incluem. Fonte da verdade no código.

**2. Hook `usePlanoAtivo()`**
Lê `assinaturas` + `planos` da barbearia logada e devolve:
- `plano` ("basico" | "premium" | "enterprise")
- `temAcesso(featureId) → boolean`
- `limites: { profissionais, agendamentosMes }`
- `assinaturaAtiva` (status em_dia/atrasado)

**3. Três camadas de bloqueio**

| Camada | Onde | O que faz |
|--------|------|-----------|
| Menu | `DonoLayout` | Esconde itens que o plano não inclui (ou mostra com cadeado + "Upgrade") |
| Rota | `<FeatureGate feature="whatsapp">` | Se entrar pela URL, mostra tela "Disponível no plano Premium" com CTA de upgrade |
| Backend | RLS + Edge Functions | Validação real (sem isso dá pra burlar). Ex: `send-whatsapp` checa o plano antes de enviar |

**4. Validação de limites**
- Ao cadastrar profissional: conta quantos já existem vs `limite_barbeiros`
- Ao criar agendamento: conta no mês vs `limite_agendamentos` (trigger no banco)
- Bloqueia com toast: "Limite do plano atingido — faça upgrade"

**5. Painel Admin (super_admin)**
Página `/admin/planos` ganha editor de features: checkbox por feature pra cada plano. Mudou aqui → vale pra todas as barbearias daquele plano na hora (sem deploy).

### Entregáveis (em 3 turnos)

**Turno 1 — Base**
- `src/config/features.ts` com catálogo
- Migration: adiciona coluna `features text[]` em `planos` (se já não usar `recursos`) + popula os 3 planos com os defaults acima
- Hook `usePlanoAtivo()` + componente `<FeatureGate>`
- Aplica no `DonoLayout` (menu com cadeados)

**Turno 2 — Gates de rota + limites**
- `<FeatureGate>` em todas as páginas premium (WhatsApp, Promoções, Fidelidade, Estoque, Multi-unidade, etc.)
- Tela genérica de upgrade com CTA pros planos
- Trigger no banco pra contar agendamentos do mês e validar limite
- Validação de `limite_barbeiros` no cadastro de profissional

**Turno 3 — Admin + backend hardening**
- Editor visual de features por plano em `/admin/planos`
- Edge functions críticas (WhatsApp, MP Connect) validam plano via RPC `has_feature(barbearia_id, feature_id)`
- Auditoria: log quando alguém tenta acessar feature bloqueada

### Detalhes técnicos

- Coluna `recursos` da tabela `planos` já existe como `text[]` — vamos reaproveitar como `features text[]` com os IDs do catálogo (ex: `['whatsapp','comissoes','estoque']`).
- A função `has_feature(_barbearia_id, _feature_id)` será `SECURITY DEFINER` e usada por RLS de tabelas premium (ex: `cliente_preferencias_notificacao` só insere se plano tem `whatsapp`).
- Limites ficam em colunas dedicadas (`limite_barbeiros`, `limite_agendamentos`) já existentes — `NULL` = ilimitado.
- O upgrade abre o checkout Mercado Pago já existente passando o `plano_id` novo.

Confirma essa divisão dos planos (ou quer ajustar alguma feature de lugar) que eu começo pelo Turno 1?
