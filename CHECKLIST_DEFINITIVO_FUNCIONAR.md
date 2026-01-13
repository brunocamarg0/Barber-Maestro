# ✅ Checklist Definitivo - Fazer Cadastro e Login Funcionarem

## 🎯 Objetivo

Fazer o cadastro e login funcionarem **DE UMA VEZ POR TODAS**.

---

## 📋 Checklist Completo

### ✅ Passo 1: Verificar Backend no Railway

#### 1.1. Status do Serviço
- [ ] No Railway, o serviço está **"Active"** (verde)?
- [ ] Se estiver "Crashed" ou "Failed", veja os logs

#### 1.2. Testar Backend Diretamente
- [ ] Abra no navegador: `https://groom-guru-platform-production.up.railway.app/api/health`
- [ ] Deve retornar: `{"status": "API is running", ...}`
- [ ] Se **NÃO** retornar → Backend está offline

**Se backend estiver offline:**
- Veja os logs no Railway
- Procure por erros
- Verifique se o deploy foi concluído

---

### ✅ Passo 2: Verificar Variáveis de Ambiente no Railway

No Railway, vá em **Variables** e verifique se TODAS existem:

- [ ] **DATABASE_URL** = `postgresql://postgres:1hoPO26EVLSTW5Uz@db.zozmkzcuulgwjbbpgple.supabase.co:5432/postgres`
- [ ] **JWT_SECRET** = `c6cf108f-35cf-43b0-b065-56861713a158`
- [ ] **SESSION_SECRET** = `c6cf108f-35cf-43b0-b065-56861713a158`
- [ ] **NODE_ENV** = `production`
- [ ] **PORT** = `3001`
- [ ] **FRONTEND_URL** = `https://groom-guru-platform.vercel.app`

**Se alguma estiver faltando:**
1. Clique em **"+ New Variable"**
2. Adicione a variável faltante
3. Salve
4. Railway vai fazer deploy automaticamente

---

### ✅ Passo 3: Verificar Deploy do Railway

#### 3.1. Status do Deploy
- [ ] No Railway, vá em **Deployments**
- [ ] Último deploy está **"SUCCESS"** (verde)?
- [ ] Se estiver **"FAILED"** (vermelho):
  - Clique no deploy
  - Veja os logs
  - Identifique o erro

#### 3.2. Logs do Deploy
Nos logs, deve aparecer:
- [ ] `✔ Generated Prisma Client`
- [ ] `> groom-guru-backend@1.0.0 build`
- [ ] `> tsc` (sem erros)
- [ ] `> groom-guru-backend@1.0.0 start`
- [ ] `🚀 Server is running on port 3001`

**Se aparecer erros:**
- Copie os erros completos
- Me envie para corrigir

---

### ✅ Passo 4: Verificar Root Directory no Railway

- [ ] No Railway, vá em **Settings** → **Service**
- [ ] Role até **"Root Directory"**
- [ ] Deve estar: `backend`
- [ ] Se estiver vazio ou errado:
  - Digite: `backend`
  - Salve
  - Railway vai fazer deploy

---

### ✅ Passo 5: Verificar Variável na Vercel

#### 5.1. Variável de Ambiente
- [ ] Acesse: `https://vercel.com/brunos-projects-9672b208/groom-guru-platform`
- [ ] Vá em **Settings** → **Environment Variables**
- [ ] Procure por: `VITE_API_URL`
- [ ] Valor deve ser: `https://groom-guru-platform-production.up.railway.app/api`
- [ ] Marque: ✅ Production, ✅ Preview, ✅ Development

**Se não existir ou estiver errado:**
1. Clique em **"+ Add New"**
2. Name: `VITE_API_URL`
3. Value: `https://groom-guru-platform-production.up.railway.app/api`
4. Marque todas as opções
5. Salve

#### 5.2. Redeploy do Frontend
- [ ] Na Vercel, vá em **Deployments**
- [ ] Clique nos **3 pontinhos** (⋯) do último deploy
- [ ] Clique em **"Redeploy"**
- [ ] Aguarde terminar (2-3 minutos)

---

### ✅ Passo 6: Teste Final

#### 6.1. Testar Health Check
- [ ] Abra: `https://groom-guru-platform-production.up.railway.app/api/health`
- [ ] Deve retornar JSON com `"status": "API is running"`

#### 6.2. Testar Cadastro
- [ ] Acesse: `https://groom-guru-platform.vercel.app/cadastro?tipo=dono`
- [ ] Preencha o formulário
- [ ] Clique em **CADASTRAR**
- [ ] Deve funcionar sem erros

#### 6.3. Testar Login
- [ ] Acesse: `https://groom-guru-platform.vercel.app/login`
- [ ] Use as credenciais criadas
- [ ] Clique em **ENTRAR**
- [ ] Deve fazer login e redirecionar

---

## 🆘 Se Ainda Não Funcionar

### Diagnóstico Rápido

1. **Backend está online?**
   - Teste: `https://groom-guru-platform-production.up.railway.app/api/health`
   - Se não responder → Backend offline

2. **CORS está configurado?**
   - Verifique se `FRONTEND_URL` está no Railway
   - Valor: `https://groom-guru-platform.vercel.app`

3. **Frontend está usando URL correta?**
   - Abra console (F12)
   - Veja qual URL está sendo usada
   - Deve ser: `https://groom-guru-platform-production.up.railway.app/api`

---

## 📋 Informações para Me Enviar

Se ainda não funcionar, me envie:

1. **Status no Railway:** Active/Crashed/Failed?
2. **Teste do health check:** Funciona ou não?
3. **Últimas 30 linhas dos logs do Railway:** (copie e cole)
4. **Variáveis configuradas:** Quais existem?
5. **Erro no console do navegador:** (F12 → Console)

---

## 🎯 Resumo Rápido

**Para funcionar, precisa ter:**

1. ✅ Backend online no Railway (status: Active)
2. ✅ 6 variáveis de ambiente no Railway
3. ✅ Variável `VITE_API_URL` na Vercel
4. ✅ Frontend redeployado na Vercel
5. ✅ CORS configurado (`FRONTEND_URL` no Railway)

---

**Siga esse checklist passo a passo e me diga onde parou!** 🔍

