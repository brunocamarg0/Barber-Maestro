# 🎯 Configuração Final do Webhook - Barber Payments

## ✅ URL do Site Confirmada

**Site:** https://groom-guru-platform.vercel.app

---

## 🔗 URL do Webhook

```
https://groom-guru-platform.vercel.app/api/pagamentos/webhook
```

---

## 📋 Passo a Passo para Configurar Webhook no Mercado Pago

### Passo 1: Acessar o Painel do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
2. Faça login na sua conta de desenvolvedor
3. Certifique-se de estar na aplicação **"Barber Payments"**

### Passo 2: Criar/Editar Webhook

1. Clique em **"Criar Webhook"** ou **"Adicionar Webhook"**
2. Se já existe um webhook, clique nele para editar

### Passo 3: Configurar o Webhook

**Preencha os campos:**

#### URL do Webhook:
```
https://groom-guru-platform.vercel.app/api/pagamentos/webhook
```

⚠️ **Copie exatamente assim!** (sem barra no final)

#### Eventos para Escutar:
Marque os seguintes eventos:
- ✅ `payment.created` - Quando um pagamento é criado
- ✅ `payment.updated` - Quando um pagamento é atualizado  
- ✅ `payment.approved` - Quando um pagamento é aprovado
- ✅ `payment.rejected` - Quando um pagamento é recusado
- ✅ `payment.cancelled` - Quando um pagamento é cancelado
- ✅ `payment.pending` - Quando um pagamento está pendente

**Ou simplesmente marque:** ✅ **"Todos os eventos de pagamento"**

#### Versão da API:
- Selecione a versão mais recente (geralmente `v1` ou a última disponível)

#### Estado (Status):
- ✅ **Ativo**

### Passo 4: Salvar e Testar

1. Revise todas as configurações
2. Clique em **"Salvar"** ou **"Criar Webhook"**
3. O Mercado Pago tentará fazer uma requisição de teste automaticamente

### Passo 5: Verificar Teste

Você deve ver:
- ✅ **Status: 200 OK**
- ✅ **Teste bem-sucedido**

Se aparecer erro:
- Verifique se o deploy no Vercel está completo
- Verifique se a função `/api/pagamentos/webhook` está deployada
- Aguarde alguns minutos e tente novamente

---

## 🔍 Verificar se o Webhook Está Funcionando

### No Mercado Pago:

1. Vá em **Webhooks** → Seu webhook criado
2. Veja o histórico de eventos
3. Deve aparecer: `payment.updated` com status `200 OK`

### No Vercel:

1. Acesse: https://vercel.com/brunos-projects-9672b208/groom-guru-platform
2. Vá em **Functions** (ou **Serverless Functions**)
3. Procure por: `/api/pagamentos/webhook`
4. Clique e veja os **Logs**
5. Você deve ver logs como:
   ```
   📥 Webhook recebido do Mercado Pago
   🧪 Requisição de TESTE detectada - retornando sucesso
   ```

---

## ✅ Checklist Final

### Antes de Considerar Completo:

#### Vercel:
- [ ] Variável `VITE_MERCADOPAGO_ACCESS_TOKEN` configurada
- [ ] Variável `MERCADOPAGO_ACCESS_TOKEN` configurada
- [ ] Novo deploy realizado após adicionar variáveis
- [ ] Site funcionando: https://groom-guru-platform.vercel.app

#### Mercado Pago:
- [ ] Webhook criado na aplicação "Barber Payments"
- [ ] URL configurada: `https://groom-guru-platform.vercel.app/api/pagamentos/webhook`
- [ ] Eventos de pagamento configurados
- [ ] Teste do webhook passou (Status: 200 OK)
- [ ] Webhook está **Ativo**

#### Sistema:
- [ ] Arquivo `.env` configurado localmente
- [ ] Teste de agendamento realizado
- [ ] Teste de checkout realizado
- [ ] Teste de pagamento realizado (com cartão de teste)

---

## 🧪 Testar Pagamento Completo

1. **Acesse o site:** https://groom-guru-platform.vercel.app
2. **Faça login como cliente** (qualquer email/senha funciona no modo mock)
3. **Crie um agendamento:**
   - Selecione barbearia
   - Selecione serviço
   - Escolha data e hora
4. **Vá para checkout**
5. **Teste com cartão de teste do Mercado Pago:**
   - **Aprovado:** `5031 4332 1540 6351`
   - Use qualquer data futura
   - Use qualquer CVV (3 dígitos)
6. **Complete o pagamento**
7. **Verifique o webhook:**
   - No Vercel → Functions → Logs
   - No Mercado Pago → Webhooks → Histórico

---

## 🚨 Troubleshooting

### Webhook retorna 400 ou 404:

1. Verifique se o deploy foi concluído
2. Verifique se o arquivo `api/pagamentos/webhook.js` existe
3. Faça um novo deploy no Vercel
4. Aguarde 2-3 minutos após o deploy

### Webhook não recebe eventos:

1. Verifique se está marcado "Ativo" no Mercado Pago
2. Verifique se os eventos estão configurados
3. Faça um pagamento de teste para gerar evento
4. Verifique os logs no Vercel

### Variáveis de ambiente não funcionam:

1. Certifique-se de que fez um novo deploy após adicionar variáveis
2. As variáveis só ficam disponíveis em novos deploys
3. Verifique se está nos ambientes corretos (Production, Preview, Development)

---

## 📞 URLs Importantes

- **Site:** https://groom-guru-platform.vercel.app
- **Dashboard Vercel:** https://vercel.com/brunos-projects-9672b208/groom-guru-platform
- **Webhook URL:** https://groom-guru-platform.vercel.app/api/pagamentos/webhook
- **Mercado Pago Webhooks:** https://www.mercadopago.com.br/developers/panel/webhooks
- **Mercado Pago Credentials:** https://www.mercadopago.com.br/developers/panel/credentials

---

## ✅ Pronto!

Com essa configuração, seu sistema de pagamento está **100% funcional**!

**Credenciais Configuradas:**
- ✅ Access Token TESTE: `TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86`
- ✅ Access Token PRODUÇÃO: `APP_USR-8486103730650159-011013-b40053edbcf5da8c865f20d2399babb9-244299462`
- ✅ Webhook URL: `https://groom-guru-platform.vercel.app/api/pagamentos/webhook`
- ✅ Integração: Barber Payments (Checkout Transparente)

**Agora é só testar! 🚀**

