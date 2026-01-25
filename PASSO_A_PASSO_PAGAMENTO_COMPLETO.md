# 💳 Passo a Passo: Deixar Sistema de Pagamento Pronto

Este guia completo mostra tudo que precisa ser feito para o sistema de pagamento funcionar 100%.

---

## 📋 Checklist Geral

- [ ] 1. Executar migrations no banco de dados
- [ ] 2. Criar conta no Mercado Pago
- [ ] 3. Obter Access Token do Mercado Pago
- [ ] 4. Configurar variáveis de ambiente no Railway
- [ ] 5. Configurar webhook no Mercado Pago
- [ ] 6. Testar pagamento online
- [ ] 7. Testar pagamento presencial

---

## 🗄️ PASSO 1: Executar Migrations no Banco de Dados

### O que precisa fazer:
Adicionar as colunas `formaPagamento` no `Agendamento` e campos do Mercado Pago no `Pagamento`.

### Como fazer:

#### Opção A: Via Railway CLI (Recomendado)

```bash
# 1. Instalar Railway CLI (se não tiver)
npm i -g @railway/cli

# 2. Login no Railway
railway login

# 3. Conectar ao projeto
railway link
# (Selecione o projeto do backend)

# 4. Executar migrations
cd backend
railway run npx prisma migrate deploy
```

**Resultado esperado:**
```
✅ Migration aplicada com sucesso
```

---

#### Opção B: Via SQL Direto no Banco

**Se você usa Supabase:**
1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto
3. Vá em **SQL Editor**
4. Clique em **New query**
5. Cole e execute:

```sql
-- Adicionar formaPagamento ao Agendamento
ALTER TABLE "Agendamento" ADD COLUMN IF NOT EXISTS "formaPagamento" TEXT;

-- Adicionar campos do Mercado Pago ao Pagamento
ALTER TABLE "Pagamento" ADD COLUMN IF NOT EXISTS "mercadoPagoPreferenceId" TEXT;
ALTER TABLE "Pagamento" ADD COLUMN IF NOT EXISTS "mercadoPagoPaymentId" TEXT;
ALTER TABLE "Pagamento" ADD COLUMN IF NOT EXISTS "mercadoPagoStatus" TEXT;
ALTER TABLE "Pagamento" ADD COLUMN IF NOT EXISTS "mercadoPagoPaymentType" TEXT;
```

6. Clique em **Run** ou pressione `Ctrl+Enter`

---

**Se você usa Neon:**
1. Acesse: https://console.neon.tech
2. Abra seu projeto
3. Vá em **SQL Editor**
4. Execute o mesmo SQL acima

---

**Se você usa outro banco:**
- Use um cliente SQL (DBeaver, pgAdmin, etc.)
- Conecte ao banco usando a `DATABASE_URL` do Railway
- Execute o SQL acima

---

### ✅ Verificar se funcionou:

Execute no banco:

```sql
-- Verificar coluna formaPagamento
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Agendamento' AND column_name = 'formaPagamento';

-- Verificar colunas do Mercado Pago
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Pagamento' AND column_name LIKE 'mercadoPago%';
```

**Se retornar linhas, as colunas foram criadas! ✅**

---

## 💰 PASSO 2: Criar Conta no Mercado Pago

### O que precisa fazer:
Criar uma conta de desenvolvedor no Mercado Pago para obter as credenciais.

### Como fazer:

1. **Acesse:** https://www.mercadopago.com.br/developers
2. **Clique em "Criar conta"** ou faça login
3. **Complete o cadastro** (pode usar conta pessoal)
4. **Acesse o painel:** https://www.mercadopago.com.br/developers/panel

---

## 🔑 PASSO 3: Obter Access Token do Mercado Pago

### O que precisa fazer:
Criar uma aplicação no Mercado Pago e obter o Access Token.

### Como fazer:

1. **No painel do Mercado Pago**, vá em **"Suas integrações"**
2. **Clique em "Criar aplicação"**
3. **Preencha:**
   - **Nome:** Groom Guru Platform
   - **Descrição:** Sistema de agendamento para barbearias
   - **Plataforma:** Web
4. **Clique em "Criar"**

5. **Após criar, vá em "Credenciais"**
6. **Você verá duas opções:**
   - **Credenciais de teste** (para desenvolvimento)
   - **Credenciais de produção** (para produção)

7. **Para começar, use as Credenciais de Teste:**
   - Copie o **"Access Token"** (começa com `TEST-...`)

⚠️ **IMPORTANTE:**
- **Test Token:** Use durante desenvolvimento/testes (não cobra dinheiro real)
- **Production Token:** Use apenas em produção (requer verificação de conta)

---

## 🌐 PASSO 4: Configurar Variáveis de Ambiente no Railway

### O que precisa fazer:
Adicionar o Access Token do Mercado Pago nas variáveis de ambiente do Railway.

### Como fazer:

1. **Acesse:** https://railway.app
2. **Abra seu projeto** do backend
3. **Clique no serviço** do backend
4. **Vá em "Variables"** (ou "Settings" → "Variables")
5. **Clique em "New Variable"**
6. **Adicione:**
   - **Nome:** `MERCADOPAGO_ACCESS_TOKEN`
   - **Valor:** Cole o Access Token que você copiou (ex: `TEST-1234567890-...`)
7. **Clique em "Add"**
8. **Aguarde alguns segundos** para o serviço reiniciar

### ✅ Verificar se funcionou:

1. **Vá em "Deployments"**
2. **Verifique os logs** mais recentes
3. **Procure por:**
   ```
   ✅ Server is running
   ```
4. **Não deve aparecer erros** relacionados ao Mercado Pago

---

## 🔗 PASSO 5: Configurar Webhook no Mercado Pago

### O que precisa fazer:
Configurar o webhook para o Mercado Pago notificar quando um pagamento for aprovado.

### Como fazer:

1. **No painel do Mercado Pago**, vá em **"Suas integrações"**
2. **Abra sua aplicação** (Groom Guru Platform)
3. **Vá em "Webhooks"** ou **"Notificações"**
4. **Clique em "Adicionar webhook"** ou **"Configurar"**
5. **Preencha:**
   - **URL:** `https://SEU-BACKEND.railway.app/api/pagamentos/webhook`
     - Substitua `SEU-BACKEND.railway.app` pela URL real do seu backend
     - Exemplo: `https://groom-guru-platform-production.up.railway.app/api/pagamentos/webhook`
   - **Eventos:** Selecione:
     - ✅ `payment`
     - ✅ `payment.updated`
6. **Salve** as configurações

### ⚠️ IMPORTANTE:

- A URL do webhook deve ser **pública** (acessível da internet)
- O Railway já fornece uma URL pública automaticamente
- Se estiver em desenvolvimento local, use um túnel (ngrok, etc.)

---

## 🧪 PASSO 6: Testar Pagamento Online

### O que precisa fazer:
Testar o fluxo completo de pagamento online com cartão de teste.

### Como fazer:

1. **Acesse o frontend** (Vercel ou local)
2. **Faça login como cliente**
3. **Vá em "Agendar Serviço"**
4. **Preencha:**
   - Selecione uma barbearia
   - Escolha um serviço
   - Escolha data e horário
5. **Clique em "Confirmar Agendamento"**
6. **Na tela de pagamento, selecione "Pagamento Online"**
7. **Clique em "Pagar Agora"**
8. **Você será redirecionado** para o checkout do Mercado Pago
9. **Use um cartão de teste:**

   **Cartão Aprovado:**
   - Número: `5031 4332 1540 6351`
   - CVV: `123`
   - Data: Qualquer data futura (ex: 12/25)
   - Nome: Qualquer nome

10. **Complete o pagamento**
11. **Você será redirecionado** para `/cliente/pagamento/sucesso`
12. **Verifique:**
    - O agendamento deve estar com status "confirmado"
    - O pagamento deve estar com status "pago"

### ✅ Verificar se funcionou:

1. **No painel do dono**, verifique:
   - Agendamento aparece como "confirmado"
   - Pagamento aparece como "pago"

2. **No Mercado Pago**, vá em **"Pagamentos"**:
   - Deve aparecer o pagamento de teste
   - Status: "Aprovado"

---

## 🏪 PASSO 7: Testar Pagamento Presencial

### O que precisa fazer:
Testar o fluxo de pagamento presencial (na barbearia).

### Como fazer:

1. **Acesse o frontend**
2. **Crie um novo agendamento**
3. **Na tela de pagamento, selecione "Pagamento na Barbearia"**
4. **Clique em "Confirmar Agendamento"**
5. **Verifique:**
   - Agendamento criado com sucesso
   - Mensagem: "Você pagará na barbearia no dia do atendimento"
   - Status do agendamento: "pendente" ou "confirmado" (depende da configuração)

---

## 🔍 Verificações Finais

### ✅ Checklist de Verificação:

- [ ] Migrations executadas no banco
- [ ] Access Token do Mercado Pago configurado no Railway
- [ ] Webhook configurado no Mercado Pago
- [ ] Pagamento online funcionando (teste com cartão de teste)
- [ ] Pagamento presencial funcionando
- [ ] Agendamentos sendo criados corretamente
- [ ] Status de pagamento sendo atualizado

---

## 🐛 Troubleshooting

### Erro: "Access Token inválido"
- ✅ Verifique se o `MERCADOPAGO_ACCESS_TOKEN` está configurado no Railway
- ✅ Certifique-se de que copiou o token completo (sem espaços)
- ✅ Verifique se está usando o token correto (Test ou Production)

### Erro: "Webhook não recebido"
- ✅ Verifique se a URL do webhook está correta
- ✅ Certifique-se de que o backend está acessível publicamente
- ✅ Verifique os logs do Railway para ver se o webhook está chegando

### Erro: "Coluna não existe"
- ✅ Execute as migrations (Passo 1)
- ✅ Verifique se as colunas foram criadas no banco

### Pagamento não atualiza status
- ✅ Verifique se o webhook está configurado corretamente
- ✅ Verifique os logs do backend para erros
- ✅ Certifique-se de que o `external_reference` está sendo passado

---

## 📚 Documentação Adicional

- **Mercado Pago Developers:** https://www.mercadopago.com.br/developers/pt/docs
- **Checkout Pro:** https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing
- **Cartões de Teste:** https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/test-cards
- **Webhooks:** https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks

---

## 🆘 Precisa de Ajuda?

Se precisar de alguma informação ou tiver dúvidas em algum passo, me envie:

1. **Qual passo você está?**
2. **Qual erro está aparecendo?** (se houver)
3. **O que você já fez?**
4. **Screenshots ou logs** (se possível)

Vou te ajudar a resolver! 🚀

---

**Boa sorte!** 🎉



