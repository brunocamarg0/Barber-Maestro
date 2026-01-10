# Configuração do Mercado Pago - BarberPro

## ✅ Credenciais Configuradas - Barber Payments

**Integração:** Checkout Transparente

Seu **Access Token de TESTE** do Mercado Pago já está configurado:
```
TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86
```

Seu **Access Token de PRODUÇÃO** (quando estiver pronto):
```
APP_USR-8486103730650159-011013-b40053edbcf5da8c865f20d2399babb9-244299462
```

⚠️ **IMPORTANTE**: 
- Token de **TESTE** - pagamentos **NÃO** são reais (use para desenvolvimento)
- Token de **PRODUÇÃO** - pagamentos são **REAIS** (use apenas quando estiver pronto)

## 🚀 Configuração Rápida

### 1. **Configurar Variáveis de Ambiente Localmente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Mercado Pago - Barber Payments (Checkout Transparente)
# Access Token de TESTE (não debita valores reais)
VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86

# Para Serverless Functions (Vercel)
MERCADOPAGO_ACCESS_TOKEN=TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86

# Para PRODUÇÃO, descomente e use:
# VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-8486103730650159-011013-b40053edbcf5da8c865f20d2399babb9-244299462
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-8486103730650159-011013-b40053edbcf5da8c865f20d2399babb9-244299462
```

✅ **TOKEN DE TESTE**: Pagamentos **NÃO** são reais - perfeito para desenvolvimento!

### 2. **Configurar no Vercel (Deploy)**

1. Acesse o painel do Vercel do seu projeto
2. Vá em **Settings** → **Environment Variables**
3. Adicione a variável:
   - **Name**: `VITE_MERCADOPAGO_ACCESS_TOKEN`
   - **Value**: `TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86` (TESTE)
   - **Environment**: Production, Preview, Development
   
4. **Para Serverless Functions**, adicione também:
   - **Name**: `MERCADOPAGO_ACCESS_TOKEN`
   - **Value**: `TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86` (TESTE)
   - **Environment**: Production, Preview, Development
   
⚠️ **Para PRODUÇÃO**, substitua pelos tokens de produção:
   - `APP_USR-8486103730650159-011013-b40053edbcf5da8c865f20d2399babb9-244299462`

### 3. **Configurar Webhooks no Mercado Pago**

1. Acesse: [https://www.mercadopago.com.br/developers/panel/webhooks](https://www.mercadopago.com.br/developers/panel/webhooks)
2. Selecione a aplicação **"Barber Payments"**
3. Clique em **Criar Webhook**
4. Configure:
   - **URL**: `https://groom-guru-platform.vercel.app/api/pagamentos/webhook`
   - **Eventos**: Selecione todos os eventos de `Pagamentos` (payment.created, payment.updated, payment.approved, etc.)
   - **Versão da API**: Use a versão mais recente
5. Clique em **Salvar**
6. O Mercado Pago fará um teste automático - deve retornar **Status: 200 OK** ✅

## 💳 Métodos de Pagamento Implementados

✅ **Cartão de Crédito/Débito** - Checkout redirect do Mercado Pago
✅ **PIX** - QR Code gerado automaticamente
✅ **Boleto** - Checkout redirect do Mercado Pago
✅ **Dinheiro** - Pagamento no local (registro local)

## 🧪 Testar Pagamentos

### **Modo de Teste (Sandbox)**

Para testar sem pagamentos reais, você precisa criar um token de teste:

1. Acesse: [https://www.mercadopago.com.br/developers/panel/credentials](https://www.mercadopago.com.br/developers/panel/credentials)
2. Copie seu **Access Token de Teste** (começa com `TEST-`)
3. Use no `.env`:
   ```env
   VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-seu_token_de_teste_aqui
   ```

### **Cartões de Teste do Mercado Pago**

Use estes cartões para testes:

- **Aprovado**: `5031 4332 1540 6351`
- **Recusado**: `5031 4332 1540 6369`
- **Requer autenticação**: `5031 4332 1540 6377`

Use qualquer data futura e qualquer CVV (3 dígitos).

### **Pagamento Real (Produção)**

⚠️ **ATENÇÃO**: Com o token de produção, todos os pagamentos são **REAIS**!

- Use qualquer cartão de crédito/débito real
- O dinheiro será debitado normalmente
- Taxas do Mercado Pago aplicadas:
  - Cartão: ~4.99% + R$ 0,60
  - PIX: ~1.99% + R$ 0,60
  - Boleto: ~1.99% + R$ 0,60

**Recomendação**: Teste primeiro com valores pequenos (R$ 1,00)

## 📋 Fluxo de Pagamento

1. **Cliente** → Faz agendamento → Checkout
2. **Cliente** → Escolhe método de pagamento
3. **Sistema** → Cria preferência/pagamento no Mercado Pago
4. **Mercado Pago** → Redireciona para checkout (cartão/boleto) ou gera QR Code (PIX)
5. **Cliente** → Realiza pagamento
6. **Mercado Pago** → Envia webhook para `/api/pagamentos/webhook`
7. **Sistema** → Atualiza status do agendamento

## 🔧 Estrutura de Arquivos

```
api/
  pagamentos/
    pix.js          # Endpoint para gerar PIX
    webhook.js      # Endpoint para receber webhooks do Mercado Pago

src/
  services/
    mercadopagoService.ts  # Serviço de integração com Mercado Pago
  
  pages/
    client/
      Checkout.tsx              # Página de checkout
      PagamentoSucesso.tsx      # Página de sucesso
      PagamentoFalha.tsx        # Página de falha
      PagamentoPendente.tsx     # Página de pendente
```

## 📊 Status de Pagamento

O sistema mapeia os status do Mercado Pago para o sistema interno:

- `approved` → `confirmado`
- `rejected` → `cancelado`
- `cancelled` → `cancelado`
- `pending` → `pagamento_pendente`
- `in_process` → `pagamento_pendente`
- `authorized` → `pagamento_pendente`

## 🔐 Segurança

⚠️ **NUNCA**:
- Exponha o Access Token no código do frontend (já está correto usando variável de ambiente)
- Faça chamadas diretas ao Mercado Pago do frontend sem backend
- Ignore erros de pagamento

✅ **SEMPRE**:
- Use HTTPS em produção
- Valide pagamentos no backend via webhooks
- Mantenha as credenciais em variáveis de ambiente
- Implemente logs para auditoria

## 📞 Suporte

- **Mercado Pago**: [https://www.mercadopago.com.br/developers/support](https://www.mercadopago.com.br/developers/support)
- **Documentação**: [https://www.mercadopago.com.br/developers/pt/docs](https://www.mercadopago.com.br/developers/pt/docs)
- **Status**: [https://status.mercadopago.com.br/](https://status.mercadopago.com.br/)

## ✅ Checklist de Configuração

- [x] Access Token configurado
- [ ] Variável de ambiente configurada localmente (`.env`)
- [ ] Variável de ambiente configurada no Vercel
- [ ] Webhook configurado no painel do Mercado Pago
- [ ] Teste de pagamento realizado (sandbox ou produção)
- [ ] URLs de retorno testadas

## 🚨 Próximos Passos

1. Teste o sistema localmente com token de teste
2. Configure as variáveis de ambiente no Vercel
3. Configure o webhook no Mercado Pago
4. Teste um pagamento real com valor pequeno (R$ 1,00)
5. Verifique se o webhook está funcionando
6. Ajuste conforme necessário

**Pronto para usar! 🎉**

