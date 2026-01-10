# 📋 Informações Necessárias para Configurar "Barber Payments"

## 🎯 Objetivo
Configurar completamente a integração "Barber Payments" no Mercado Pago e Vercel para que o sistema de pagamento funcione corretamente.

---

## 🔑 1. Credenciais do Mercado Pago - "Barber Payments"

### A. Access Token (Token de Acesso)
**Onde encontrar:** https://www.mercadopago.com.br/developers/panel/credentials

**Informações necessárias:**
- [ ] **Access Token de TESTE** (começa com `TEST-`)
  - Formato: `TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - Exemplo: `TEST-8486103730650159-011013-d9b8c1862c8cc1c0a7f65d389fe0c3df-244299462`
  
- [ ] **Access Token de PRODUÇÃO** (começa com `APP_USR-`)
  - Formato: `APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - Exemplo: `APP_USR-8198153225284103-071221-68070ac52617404b0cdf2c61202ce95c-2557085916`

**Importante:** 
- Use o token de TESTE para desenvolvimento
- Use o token de PRODUÇÃO apenas quando estiver pronto para pagamentos reais

### B. Public Key (Chave Pública) - Opcional
**Onde encontrar:** Mesma página de credentials

**Informações necessárias:**
- [ ] **Public Key de TESTE** (começa com `TEST-`)
- [ ] **Public Key de PRODUÇÃO** (começa com `APP_USR-`)

**Nota:** Esta chave pode não ser necessária dependendo da implementação, mas é bom ter.

### C. Application ID (ID da Aplicação)
**Onde encontrar:** Painel do desenvolvedor

**Informações necessárias:**
- [ ] **Application ID** ou **Client ID**
  - Exemplo: `244299462` (últimos números do Access Token)

---

## 🌐 2. Configuração de Webhook

### A. URL do Webhook
**Onde configurar:** https://www.mercadopago.com.br/developers/panel/webhooks

**Informações necessárias:**
- [ ] **URL do Webhook** (após deploy no Vercel)
  - Formato: `https://seu-projeto.vercel.app/api/pagamentos/webhook`
  - Exemplo: `https://groom-guru-platform.vercel.app/api/pagamentos/webhook`
  
**⚠️ IMPORTANTE:** 
- A URL será gerada após fazer deploy no Vercel
- Se já tem deploy, me envie a URL do seu projeto no Vercel

### B. Eventos do Webhook
**Eventos que precisam estar configurados:**

- [x] `payment.created` - Quando um pagamento é criado
- [x] `payment.updated` - Quando um pagamento é atualizado
- [x] `payment.approved` - Quando um pagamento é aprovado
- [x] `payment.rejected` - Quando um pagamento é recusado
- [x] `payment.cancelled` - Quando um pagamento é cancelado
- [x] `payment.pending` - Quando um pagamento está pendente

**Me informe quais eventos já estão configurados ou se precisa configurar todos.**

---

## ☁️ 3. Configuração no Vercel

### A. Variáveis de Ambiente Necessárias

**Preciso saber:**
- [ ] **URL do projeto no Vercel**
  - Exemplo: `https://groom-guru-platform.vercel.app`
  - Ou: `https://groom-guru-platform-brunocamarg0.vercel.app`

**Variáveis que serão configuradas:**

#### Para Frontend (VITE_):
```env
VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-seu_token_aqui
```

#### Para Serverless Functions:
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-seu_token_aqui
```

**Me informe:**
- [ ] Já tem projeto criado no Vercel?
- [ ] Qual é a URL do projeto?
- [ ] Já configurou alguma variável de ambiente antes?

---

## 💳 4. Informações da Aplicação "Barber Payments"

**Preciso saber:**
- [ ] **Nome da aplicação no Mercado Pago:** "Barber Payments" (confirmar)
- [ ] **ID da aplicação:** (os últimos números do Access Token)
- [ ] **Ambiente:** Teste ou Produção? (ou ambos?)
- [ ] **Descrição do estabelecimento:** "BarberPro" ou outro nome?

---

## 🔧 5. Configurações Adicionais (Opcional mas Recomendado)

### A. Statement Descriptor
**O que aparece na fatura do cartão:**
- [ ] Nome que aparece na fatura (ex: "BARBERPRO")
- [ ] Máximo: 22 caracteres

### B. Notificação URL Base
- [ ] URL base para notificações (geralmente a mesma do webhook)
  - Formato: `https://seu-projeto.vercel.app`

### C. Redirect URLs
**URLs de retorno após pagamento:**
- [ ] URL de sucesso: `https://seu-projeto.vercel.app/client/pagamento/sucesso`
- [ ] URL de falha: `https://seu-projeto.vercel.app/client/pagamento/falha`
- [ ] URL de pendente: `https://seu-projeto.vercel.app/client/pagamento/pendente`

---

## 📝 6. Checklist - O que você precisa me enviar:

### ✅ OBRIGATÓRIO:
- [ ] Access Token de TESTE (`TEST-...`)
- [ ] Access Token de PRODUÇÃO (`APP_USR-...`) - se já tiver
- [ ] URL do projeto no Vercel (se já tiver deploy)

### ✅ RECOMENDADO:
- [ ] Public Key de TESTE
- [ ] Application ID
- [ ] Nome exato da aplicação no Mercado Pago
- [ ] URLs de retorno preferidas

### ✅ OPCIONAL:
- [ ] Public Key de PRODUÇÃO
- [ ] Statement Descriptor personalizado
- [ ] Outras configurações específicas

---

## 🚀 Após receber as informações:

Com essas informações, eu vou:

1. ✅ Atualizar arquivo `.env` com os tokens corretos
2. ✅ Atualizar `env.example` com as informações
3. ✅ Atualizar código para usar as credenciais corretas
4. ✅ Configurar webhooks corretamente
5. ✅ Criar guia de configuração no Vercel
6. ✅ Atualizar documentação completa

---

## 📧 Formato para enviar as informações:

Você pode enviar assim:

```
ACCESS TOKEN TESTE: TEST-xxxxxxxxxxxx
ACCESS TOKEN PRODUÇÃO: APP_USR-xxxxxxxxxxxx
URL VERCEL: https://groom-guru-platform.vercel.app
NOME APLICAÇÃO: Barber Payments
```

Ou me envie print da tela do painel do Mercado Pago (ocultando dados sensíveis).

---

## ❓ Dúvidas?

Se não tiver alguma informação, não tem problema! Me envie o que tiver e eu configuro o que for possível. O resto podemos adicionar depois.

