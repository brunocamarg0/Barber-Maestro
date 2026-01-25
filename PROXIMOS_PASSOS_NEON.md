# 🚀 Próximos Passos - Neon + Mercado Pago (Já Configurado)

Você já tem:
- ✅ Banco Neon
- ✅ Conta no Mercado Pago
- ✅ Variáveis configuradas no Railway

Agora vamos completar:

---

## 📋 PASSO 1: Executar Migrations no Neon

### Como fazer:

1. **Acesse:** https://console.neon.tech
2. **Faça login** na sua conta
3. **Abra seu projeto**
4. **No menu lateral, clique em "SQL Editor"**
5. **Clique em "New query"** ou use o editor SQL
6. **Cole este SQL:**

```sql
-- Adicionar formaPagamento ao Agendamento
ALTER TABLE "Agendamento" ADD COLUMN IF NOT EXISTS "formaPagamento" TEXT;

-- Adicionar campos do Mercado Pago ao Pagamento
ALTER TABLE "Pagamento" ADD COLUMN IF NOT EXISTS "mercadoPagoPreferenceId" TEXT;
ALTER TABLE "Pagamento" ADD COLUMN IF NOT EXISTS "mercadoPagoPaymentId" TEXT;
ALTER TABLE "Pagamento" ADD COLUMN IF NOT EXISTS "mercadoPagoStatus" TEXT;
ALTER TABLE "Pagamento" ADD COLUMN IF NOT EXISTS "mercadoPagoPaymentType" TEXT;
```

7. **Clique em "Run"** ou pressione `Ctrl+Enter`

### ✅ Verificar se funcionou:

Execute esta query:

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

## 🔗 PASSO 2: Configurar Webhook no Mercado Pago

### O que precisa fazer:
Configurar o webhook para o Mercado Pago notificar quando um pagamento for aprovado.

### Como fazer:

1. **Acesse:** https://www.mercadopago.com.br/developers/panel
2. **Vá em "Suas integrações"**
3. **Abra sua aplicação** (Groom Guru Platform)
4. **Vá em "Webhooks"** ou **"Notificações"**
5. **Clique em "Adicionar webhook"** ou **"Configurar"**

6. **Preencha:**
   - **URL:** `https://groom-guru-platform-production.up.railway.app/api/pagamentos/webhook`
     - ⚠️ **Substitua pela URL real do seu backend no Railway!**
   - **Eventos:** Selecione:
     - ✅ `payment`
     - ✅ `payment.updated`

7. **Salve** as configurações

### 🔍 Como encontrar a URL do seu backend:

1. **Acesse:** https://railway.app
2. **Abra seu projeto** do backend
3. **Clique no serviço** do backend
4. **Vá em "Settings"** ou **"Deployments"**
5. **Procure por "Public Domain"** ou **"Custom Domain"**
6. **Copie a URL** (exemplo: `groom-guru-platform-production.up.railway.app`)
7. **A URL completa do webhook será:**
   ```
   https://SUA-URL-AQUI.railway.app/api/pagamentos/webhook
   ```

---

## 🧪 PASSO 3: Testar o Sistema

### Teste 1: Pagamento Online

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

### Teste 2: Pagamento Presencial

1. **Crie um novo agendamento**
2. **Na tela de pagamento, selecione "Pagamento na Barbearia"**
3. **Clique em "Confirmar Agendamento"**
4. **Verifique:**
   - Agendamento criado com sucesso
   - Mensagem: "Você pagará na barbearia no dia do atendimento"

---

## ✅ Checklist Final

- [ ] Migrations executadas no Neon (Passo 1)
- [ ] Webhook configurado no Mercado Pago (Passo 2)
- [ ] Pagamento online testado e funcionando (Passo 3)
- [ ] Pagamento presencial testado e funcionando (Passo 3)

---

## 🐛 Se Algo Não Funcionar

### Erro ao executar SQL no Neon:
- ✅ Verifique se está conectado ao projeto correto
- ✅ Certifique-se de que a query está completa
- ✅ Tente executar uma query de cada vez

### Webhook não funciona:
- ✅ Verifique se a URL está correta (sem espaços)
- ✅ Certifique-se de que o backend está rodando
- ✅ Verifique os logs do Railway para ver se o webhook está chegando

### Pagamento não redireciona:
- ✅ Verifique se o `MERCADOPAGO_ACCESS_TOKEN` está configurado
- ✅ Verifique os logs do backend no Railway
- ✅ Certifique-se de que está usando o token de TEST (não Production)

---

## 📞 Me Envie:

Depois de fazer os passos, me envie:

1. **Conseguiu executar as migrations no Neon?** ✅ ou ❌
2. **Qual é a URL do seu backend no Railway?** (para configurar o webhook)
3. **Conseguiu configurar o webhook?** ✅ ou ❌
4. **O teste de pagamento funcionou?** ✅ ou ❌
5. **Algum erro apareceu?** (se sim, qual?)

Vou te ajudar com qualquer problema! 🚀



