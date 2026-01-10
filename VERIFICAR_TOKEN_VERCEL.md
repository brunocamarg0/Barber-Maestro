# 🔍 Como Verificar se o Token Está Configurado no Vercel

## 🧪 Teste Rápido

Acesse esta URL no seu navegador para verificar se o token está configurado:

```
https://groom-guru-platform.vercel.app/api/pagamentos/test-token
```

**O que você verá:**

### ✅ Se o token estiver configurado:
```json
{
  "success": true,
  "diagnostic": {
    "MERCADOPAGO_ACCESS_TOKEN": "✅ Configurado",
    "VITE_MERCADOPAGO_ACCESS_TOKEN": "✅ Configurado",
    ...
  },
  "message": "Token encontrado! ✅"
}
```

### ❌ Se o token NÃO estiver configurado:
```json
{
  "success": true,
  "diagnostic": {
    "MERCADOPAGO_ACCESS_TOKEN": "❌ Não configurado",
    "VITE_MERCADOPAGO_ACCESS_TOKEN": "❌ Não configurado",
    ...
  },
  "message": "Token NÃO encontrado! ❌ Configure MERCADOPAGO_ACCESS_TOKEN no Vercel"
}
```

---

## 🔧 Passos para Configurar Corretamente

### Passo 1: Acessar Configurações do Vercel

1. Acesse: https://vercel.com/brunos-projects-9672b208/groom-guru-platform
2. Faça login (se necessário)
3. No menu lateral, clique em **Settings** (Configurações)

### Passo 2: Ir para Environment Variables

1. No menu de Settings, clique em **Environment Variables** (Variáveis de Ambiente)
2. Você verá uma lista de variáveis (pode estar vazia)

### Passo 3: Adicionar Variável 1

1. Clique em **"Add New"** ou **"Adicionar Nova"**
2. Preencha os campos:
   - **Name (Nome):** `MERCADOPAGO_ACCESS_TOKEN`
   - **Value (Valor):** `TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86`
   - **Environments (Ambientes):**
     - ✅ **Production** (Produção)
     - ✅ **Preview** (Preview)
     - ✅ **Development** (Desenvolvimento)
3. Clique em **Save** (Salvar)

### Passo 4: Adicionar Variável 2

1. Clique em **"Add New"** novamente
2. Preencha os campos:
   - **Name (Nome):** `VITE_MERCADOPAGO_ACCESS_TOKEN`
   - **Value (Valor):** `TEST-d450f022-fc2f-4ae2-8629-e5f723e5cf86`
   - **Environments (Ambientes):**
     - ✅ **Production**
     - ✅ **Preview**
     - ✅ **Development**
3. Clique em **Save** (Salvar)

### Passo 5: Fazer Novo Deploy ⚠️ CRUCIAL!

**IMPORTANTE:** Variáveis de ambiente só ficam disponíveis em **novos deploys**!

Após adicionar as variáveis, você **DEVE** fazer um novo deploy:

#### Opção A: Redeploy Manual

1. No Vercel, vá em **Deployments** (Deploys)
2. Encontre o deployment mais recente
3. Clique nos **3 pontinhos** (⋯) do lado direito
4. Selecione **Redeploy**
5. Aguarde o deploy terminar (2-3 minutos)

#### Opção B: Deploy Automático (via Git)

1. Faça um pequeno commit (pode ser um comentário)
2. Faça push para o GitHub
3. O Vercel fará deploy automático
4. Aguarde o deploy terminar

### Passo 6: Verificar Novamente

1. Aguarde 2-3 minutos após o deploy terminar
2. Acesse: https://groom-guru-platform.vercel.app/api/pagamentos/test-token
3. Verifique se o token aparece como "✅ Configurado"
4. Tente fazer um pagamento novamente

---

## ⚠️ Problemas Comuns

### Problema 1: "Variável não encontrada após adicionar"

**Causa:** Deploy foi feito ANTES de adicionar variáveis

**Solução:** 
1. Adicione as variáveis no Vercel
2. Faça um **NOVO deploy** (Redeploy)
3. Aguarde o deploy terminar
4. Teste novamente

### Problema 2: "Variável funciona em Preview mas não em Production"

**Causa:** Variável não foi marcada para Production

**Solução:**
1. Edite a variável no Vercel
2. Marque **✅ Production** (além de Preview e Development)
3. Salve
4. Faça novo deploy

### Problema 3: "Token aparece mas pagamento ainda falha"

**Causa:** Token inválido ou expirado

**Solução:**
1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Selecione "Barber Payments"
3. Verifique se o token está ativo
4. Copie o token novamente (pode ter sido regenerado)
5. Atualize no Vercel
6. Faça novo deploy

### Problema 4: "Variável aparece no teste mas não funciona no código"

**Causa:** Nome da variável diferente no código

**Solução:**
1. Verifique qual nome está sendo usado no código
2. Certifique-se que o nome no Vercel é **exatamente igual**
3. Variáveis são case-sensitive: `MERCADOPAGO_ACCESS_TOKEN` ≠ `mercadopago_access_token`

---

## 📋 Checklist Final

Antes de considerar resolvido:

- [ ] Variável `MERCADOPAGO_ACCESS_TOKEN` adicionada no Vercel
- [ ] Variável `VITE_MERCADOPAGO_ACCESS_TOKEN` adicionada no Vercel
- [ ] Ambos os ambientes marcados: ✅ Production, ✅ Preview, ✅ Development
- [ ] Variáveis foram salvas (aparecem na lista)
- [ ] Novo deploy foi feito APÓS adicionar variáveis
- [ ] Teste em `/api/pagamentos/test-token` retorna "✅ Configurado"
- [ ] Pagamento funciona sem erro

---

## 🔍 Verificar Logs no Vercel

Se ainda não funcionar, verifique os logs:

1. Acesse: https://vercel.com/brunos-projects-9672b208/groom-guru-platform
2. Vá em **Functions** (ou **Deployments** → clique no último deploy)
3. Procure por: `/api/pagamentos/preference`
4. Clique na função
5. Vá em **Logs** ou **Runtime Logs**
6. Veja os logs de diagnóstico que adicionamos

**Logs esperados (sucesso):**
```
🔍 DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE:
MERCADOPAGO_ACCESS_TOKEN: ✅ Configurado (51 chars)
✅ Token encontrado! Tamanho: 51 Prefixo: TEST-d450f022...
```

**Logs de erro:**
```
MERCADOPAGO_ACCESS_TOKEN: ❌ Não configurado
❌ Token do Mercado Pago não configurado
```

---

## 🆘 Se Nada Funcionar

1. Verifique se está no projeto correto no Vercel
2. Verifique se fez login na conta certa
3. Tente remover e adicionar as variáveis novamente
4. Faça um deploy completamente novo
5. Entre em contato com suporte do Vercel

---

## ✅ Pronto!

Após seguir todos os passos, o token deve estar funcionando. Se ainda tiver problemas, me envie os logs do teste em `/api/pagamentos/test-token`!

