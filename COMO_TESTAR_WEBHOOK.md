# 🧪 Como Testar o Webhook do Mercado Pago

## 📋 Índice
1. [Teste Automático no Mercado Pago](#1-teste-automático-no-mercado-pago)
2. [Teste Manual com Comando](#2-teste-manual-com-comando)
3. [Teste com Pagamento Real](#3-teste-com-pagamento-real-de-teste)
4. [Verificar Logs no Vercel](#4-verificar-logs-no-vercel)
5. [Verificar Histórico no Mercado Pago](#5-verificar-histórico-no-mercado-pago)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Teste Automático no Mercado Pago ✅ (Mais Fácil)

### Passo 1: Acessar Webhooks

1. Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
2. Selecione a aplicação **"Barber Payments"**
3. Encontre o webhook que você criou
4. Clique no webhook

### Passo 2: Testar

1. Procure por um botão **"Testar"** ou **"Testar Webhook"**
2. Clique no botão
3. O Mercado Pago enviará uma requisição de teste automaticamente

### Resultado Esperado:

✅ **Status: 200 OK** - Webhook funcionando!
❌ **Status: 400/404/500** - Verifique a configuração

### O que o Mercado Pago Envia (Exemplo):

```json
{
  "action": "payment.updated",
  "api_version": "v1",
  "data": {"id": "123456"},
  "date_created": "2021-11-01T02:02:02Z",
  "id": "123456",
  "live_mode": false,
  "type": "payment",
  "user_id": 244299462
}
```

---

## 2. Teste Manual com Comando 💻

### Opção A: Usando cURL (Windows PowerShell)

Abra o PowerShell e execute:

```powershell
curl -X POST https://groom-guru-platform.vercel.app/api/pagamentos/webhook `
  -H "Content-Type: application/json" `
  -d '{
    "action": "payment.updated",
    "type": "payment",
    "data": {"id": "123456"},
    "api_version": "v1",
    "date_created": "2024-01-01T12:00:00Z",
    "id": "123456",
    "live_mode": false,
    "user_id": 244299462
  }'
```

### Opção B: Usando Invoke-WebRequest (PowerShell)

```powershell
$body = @{
    action = "payment.updated"
    type = "payment"
    data = @{id = "123456"}
    api_version = "v1"
    date_created = "2024-01-01T12:00:00Z"
    id = "123456"
    live_mode = $false
    user_id = 244299462
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://groom-guru-platform.vercel.app/api/pagamentos/webhook" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Resultado Esperado:

```json
{
  "success": true,
  "message": "Webhook de teste recebido com sucesso",
  "test": true,
  "receivedAt": "2024-01-01T12:00:00.000Z"
}
```

**Status Code:** `200 OK`

---

## 3. Teste com Pagamento Real de Teste 💳

### Passo 1: Fazer um Agendamento

1. Acesse: https://groom-guru-platform.vercel.app
2. Faça login como cliente (qualquer email/senha funciona)
3. Vá em **Novo Agendamento**
4. Selecione:
   - Barbearia
   - Serviço
   - Data e hora
5. Clique em **Continuar para Pagamento**

### Passo 2: Fazer Pagamento de Teste

1. No checkout, selecione **Cartão de Crédito**
2. Clique em **Finalizar Pagamento**
3. Você será redirecionado para o Mercado Pago
4. Use um cartão de teste:
   - **Aprovado:** `5031 4332 1540 6351`
   - Use qualquer data futura (ex: 12/25)
   - Use qualquer CVV (ex: 123)
   - Qualquer nome no cartão

### Passo 3: Completar Pagamento

1. Complete o pagamento no Mercado Pago
2. Aguarde alguns segundos
3. O Mercado Pago enviará automaticamente um webhook para seu servidor
4. Você será redirecionado de volta para o site

### Passo 4: Verificar Webhook

1. No Vercel → Functions → `/api/pagamentos/webhook` → Logs
2. Você deve ver logs como:
   ```
   📥 Webhook recebido do Mercado Pago
   💳 Processando pagamento: [ID_DO_PAGAMENTO]
   ✅ Status do pagamento: approved
   ```

---

## 4. Verificar Logs no Vercel 📊

### Passo 1: Acessar Logs

1. Acesse: https://vercel.com/brunos-projects-9672b208/groom-guru-platform
2. Vá em **Functions** (ou **Deployments** → clique no deployment mais recente)
3. Procure por: `/api/pagamentos/webhook`
4. Clique na função

### Passo 2: Ver Logs em Tempo Real

1. Clique em **Runtime Logs** ou **Logs**
2. Você verá todas as requisições recebidas
3. Procure por:
   - `📥 Webhook recebido do Mercado Pago`
   - `🧪 Requisição de TESTE detectada`
   - `💳 Processando pagamento`
   - `✅ Status do pagamento`

### Exemplo de Logs Esperados:

```
[2024-01-01 12:00:00] 📥 Webhook recebido do Mercado Pago: {"action":"payment.updated","type":"payment",...}
[2024-01-01 12:00:01] 🧪 Requisição de TESTE detectada - retornando sucesso
[2024-01-01 12:00:01] ✅ Webhook processado - Status: 200
```

---

## 5. Verificar Histórico no Mercado Pago 📋

### Passo 1: Acessar Webhooks

1. Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
2. Selecione **"Barber Payments"**
3. Clique no webhook que você criou

### Passo 2: Ver Histórico de Eventos

1. Procure por **"Histórico"**, **"Eventos"** ou **"Logs"**
2. Você verá uma lista de todas as requisições enviadas
3. Para cada evento, você verá:
   - **Data/Hora** do evento
   - **Tipo** do evento (ex: `payment.updated`)
   - **Status da Resposta** (ex: `200 OK`, `400 Error`)
   - **URL** chamada
   - **Payload** enviado

### Exemplo de Histórico:

```
📅 01/01/2024 12:00:00
🔔 payment.updated
✅ 200 OK
📡 https://groom-guru-platform.vercel.app/api/pagamentos/webhook
```

---

## 6. Troubleshooting 🔧

### Problema: Webhook retorna 400/404

**Sintomas:**
- Teste no Mercado Pago retorna erro
- Logs no Vercel mostram 400 ou 404

**Solução:**
1. Verifique se o deploy foi concluído:
   - Vercel → Deployments → Verifique se está "Ready"
2. Verifique se o arquivo existe:
   - Vercel → Functions → Procure por `/api/pagamentos/webhook`
   - Se não aparecer, o arquivo não foi deployado
3. Verifique a URL:
   - Deve ser: `https://groom-guru-platform.vercel.app/api/pagamentos/webhook`
   - **Sem** barra no final
   - **Com** `https://`
4. Faça um novo deploy:
   - Vercel → Deployments → Redeploy

### Problema: Webhook retorna 500 (Internal Server Error)

**Sintomas:**
- Teste retorna 500
- Logs mostram erro no código

**Solução:**
1. Verifique os logs no Vercel:
   - Functions → `/api/pagamentos/webhook` → Logs
   - Veja qual é o erro específico
2. Verifique variáveis de ambiente:
   - Vercel → Settings → Environment Variables
   - Certifique-se de que `MERCADOPAGO_ACCESS_TOKEN` está configurado
3. Verifique o código:
   - O webhook está retornando sempre 200 (mesmo em caso de erro)
   - Mas pode ter erros internos nos logs

### Problema: Webhook não recebe eventos

**Sintomas:**
- Pagamento foi feito, mas webhook não foi chamado
- Histórico no Mercado Pago está vazio

**Solução:**
1. Verifique se o webhook está **Ativo**:
   - Mercado Pago → Webhooks → Verifique o status
2. Verifique se os eventos estão configurados:
   - Deve ter pelo menos `payment.updated` marcado
3. Verifique se o pagamento foi realmente processado:
   - No painel do Mercado Pago, vá em **Pagamentos**
   - Veja se o pagamento aparece lá
4. Aguarde alguns minutos:
   - Webhooks podem ter delay de alguns segundos/minutos

### Problema: Teste funciona, mas pagamentos reais não

**Sintomas:**
- Teste manual retorna 200 OK
- Mas quando faz pagamento real, webhook não é chamado

**Solução:**
1. Verifique se está usando token correto:
   - Teste com token de teste: `TEST-...`
   - Produção com token de produção: `APP_USR-...`
2. Verifique se o pagamento está sendo criado corretamente:
   - Veja os logs quando cria o pagamento
   - Confirme que está usando a `notification_url` correta
3. Verifique no painel do Mercado Pago:
   - Vá em **Pagamentos** → Veja o pagamento criado
   - Verifique se há `notification_url` configurada

---

## ✅ Checklist de Teste

Antes de considerar o webhook funcionando:

- [ ] Teste automático no Mercado Pago retorna **200 OK**
- [ ] Teste manual (curl) retorna **200 OK** com `"success": true`
- [ ] Logs no Vercel mostram requisições recebidas
- [ ] Histórico no Mercado Pago mostra eventos enviados
- [ ] Pagamento de teste gera webhook automaticamente
- [ ] Status do pagamento é atualizado corretamente

---

## 🎯 Teste Rápido (1 Minuto)

**O método mais rápido:**

1. Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
2. Selecione **"Barber Payments"**
3. Clique no webhook criado
4. Clique em **"Testar"** ou **"Testar Webhook"**
5. Verifique se retorna: ✅ **Status: 200 OK**

**Pronto!** Se retornou 200 OK, o webhook está funcionando! 🎉

---

## 📞 URLs para Testar

- **Site:** https://groom-guru-platform.vercel.app
- **Webhook URL:** https://groom-guru-platform.vercel.app/api/pagamentos/webhook
- **Vercel Logs:** https://vercel.com/brunos-projects-9672b208/groom-guru-platform → Functions
- **Mercado Pago Webhooks:** https://www.mercadopago.com.br/developers/panel/webhooks
- **Mercado Pago Payments:** https://www.mercadopago.com.br/developers/panel/your_integrations/payments

---

## 💡 Dica Pro

Para testar rapidamente sem fazer pagamento:

1. Use o **teste automático** do Mercado Pago (botão "Testar")
2. Isso envia uma requisição de teste sem precisar criar pagamento real
3. Verifique os logs no Vercel para confirmar que recebeu

---

## ✅ Pronto!

Agora você tem várias formas de testar o webhook. Comece pelo **teste automático** do Mercado Pago (mais fácil) e depois faça um pagamento de teste para garantir que tudo funciona em produção!

