# 🔧 Configuração Completa no Vercel - Barber Payments

## 📍 URL do Projeto

**Dashboard Vercel:** https://vercel.com/brunos-projects-9672b208/groom-guru-platform/8MugFrvU5zAaHZmjUCq9h3S6hce9

**URL do Site:** ✅ `https://groom-guru-platform.vercel.app`

---

## 🔑 Variáveis de Ambiente no Vercel

### Passo 1: Acessar Configurações

1. Acesse: https://vercel.com/brunos-projects-9672b208/groom-guru-platform
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Environment Variables** (Variáveis de Ambiente)

### Passo 2: Adicionar Variável 1 (Frontend)

**Clique em "Add New" e preencha:**

- **Name (Nome):** `VITE_MERCADOPAGO_ACCESS_TOKEN`
- **Value (Valor):** `TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86`
- **Environment (Ambiente):**
  - ✅ Production
  - ✅ Preview  
  - ✅ Development

**Clique em "Save"**

### Passo 3: Adicionar Variável 2 (Serverless Functions)

**Clique em "Add New" novamente e preencha:**

- **Name (Nome):** `MERCADOPAGO_ACCESS_TOKEN`
- **Value (Valor):** `TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86`
- **Environment (Ambiente):**
  - ✅ Production
  - ✅ Preview
  - ✅ Development

**Clique em "Save"**

### ✅ Resultado Esperado:

Você deve ter **2 variáveis** configuradas:
1. `VITE_MERCADOPAGO_ACCESS_TOKEN` = `TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86`
2. `MERCADOPAGO_ACCESS_TOKEN` = `TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86`

---

## 🔄 Re-fazer Deploy

**IMPORTANTE:** Após adicionar variáveis de ambiente, você precisa fazer um novo deploy:

1. No painel do Vercel, vá em **Deployments**
2. Clique nos **3 pontinhos** do último deployment
3. Selecione **Redeploy**
4. Ou faça um novo commit e push para o GitHub (deploy automático)

---

## 🌐 Configurar Webhook no Mercado Pago

### Passo 1: Descobrir URL do Site

1. No Vercel, vá em **Settings** → **Domains**
2. Copie a URL do domínio (ex: `groom-guru-platform.vercel.app`)
3. A URL completa do webhook será: `https://[SEU-DOMINIO]/api/pagamentos/webhook`

**Exemplo:**
```
https://groom-guru-platform.vercel.app/api/pagamentos/webhook
```

### Passo 2: Configurar no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
2. Selecione a aplicação **"Barber Payments"**
3. Clique em **Criar Webhook** ou **Adicionar Webhook**

**Preencha:**

- **URL do Webhook:**
  ```
  https://groom-guru-platform.vercel.app/api/pagamentos/webhook
  ```
  ✅ URL correta configurada!

- **Eventos:**
  - ✅ `payment.created`
  - ✅ `payment.updated`
  - ✅ `payment.approved`
  - ✅ `payment.rejected`
  - ✅ `payment.cancelled`
  - ✅ `payment.pending`

- **Versão da API:** Use a mais recente (geralmente `v1`)

- **Status:** ✅ Ativo

4. Clique em **Salvar**

### Passo 3: Testar Webhook

1. Após salvar, o Mercado Pago fará um teste automático
2. Você deve ver: **Status: 200 OK** ✅
3. Se der erro, verifique:
   - URL está correta?
   - Deploy foi feito após adicionar variáveis?
   - Função `/api/pagamentos/webhook` está deployada?

---

## 📋 Checklist Final

### Vercel:
- [ ] Variável `VITE_MERCADOPAGO_ACCESS_TOKEN` configurada
- [ ] Variável `MERCADOPAGO_ACCESS_TOKEN` configurada
- [ ] Novo deploy realizado após adicionar variáveis
- [ ] URL do site copiada (para webhook)

### Mercado Pago:
- [ ] Webhook criado na aplicação "Barber Payments"
- [ ] URL do webhook correta (com domínio do Vercel)
- [ ] Eventos de pagamento configurados
- [ ] Teste do webhook passou (200 OK)

### Sistema:
- [ ] Site funcionando no Vercel
- [ ] Checkout funcionando
- [ ] Teste de pagamento realizado

---

## 🚨 Para Produção (Quando Estiver Pronto)

Quando quiser usar pagamentos reais, atualize as variáveis no Vercel:

**Substitua os valores por:**

- `VITE_MERCADOPAGO_ACCESS_TOKEN` = `APP_USR-8486103730650159-011013-b40053edbcf5da8c865f20d2399babb9-244299462`
- `MERCADOPAGO_ACCESS_TOKEN` = `APP_USR-8486103730650159-011013-b40053edbcf5da8c865f20d2399babb9-244299462`

⚠️ **ATENÇÃO:** Tokens de produção = pagamentos REAIS!

---

## ✅ Pronto!

Após seguir todos os passos, seu sistema estará completamente configurado!

**Precisa de ajuda?** Me envie a URL real do seu site no Vercel para eu configurar o webhook corretamente.

