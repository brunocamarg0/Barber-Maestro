# 🚀 Guia Completo: Configuração do Zero

## 📋 Índice

1. [Escolher Banco de Dados](#1-escolher-banco-de-dados)
2. [Criar Banco de Dados](#2-criar-banco-de-dados)
3. [Configurar Backend no Railway](#3-configurar-backend-no-railway)
4. [Configurar Frontend no Vercel](#4-configurar-frontend-no-vercel)
5. [Testar Tudo](#5-testar-tudo)

---

## 1. Escolher Banco de Dados

### Opção A: Supabase (Recomendado - Mais Fácil) ⭐

**Vantagens:**
- ✅ 100% gratuito (500MB)
- ✅ Interface web muito fácil
- ✅ Connection Pooling incluído
- ✅ Dashboard completo

**Link:** https://supabase.com

---

### Opção B: Google Cloud SQL (PostgreSQL)

**Vantagens:**
- ✅ Integração com Google Cloud
- ✅ Mais recursos (se tiver créditos)
- ⚠️ Requer conta Google Cloud
- ⚠️ Pode ter custos após créditos gratuitos

**Link:** https://cloud.google.com/sql

---

### Opção C: Neon (PostgreSQL) ⭐⭐

**Vantagens:**
- ✅ 100% gratuito (3GB)
- ✅ Mais espaço que Supabase
- ✅ Auto-scaling
- ✅ Connection Pooling automático

**Link:** https://neon.tech

---

### Opção D: Railway PostgreSQL (Mais Simples)

**Vantagens:**
- ✅ Mesma plataforma do backend
- ✅ Configuração automática
- ⚠️ $5 créditos/mês (pode acabar rápido)

**Link:** https://railway.app

---

## 2. Criar Banco de Dados

### 🎯 Opção Recomendada: Neon (Mais Espaço e Fácil)

#### Passo 2.1: Criar Conta no Neon

1. Acesse: https://neon.tech
2. Clique em **"Sign Up"**
3. Faça login com GitHub/Google
4. Clique em **"Create a project"**

#### Passo 2.2: Criar Projeto

1. **Nome do projeto:** `groom-guru-db`
2. **Região:** Escolha a mais próxima (ex: `South America`)
3. **PostgreSQL version:** Deixe o padrão (15 ou 16)
4. Clique em **"Create project"**

#### Passo 2.3: Obter String de Conexão

1. Após criar, você verá a **Connection string**
2. Copie a string que começa com `postgresql://...`
3. **Exemplo:**
   ```
   postgresql://usuario:senha@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

**✅ ANOTE ESSA STRING! Você vai precisar dela.**

---

### 🎯 Alternativa: Supabase

#### Passo 2.1: Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub/Google
4. Clique em **"New Project"**

#### Passo 2.2: Criar Projeto

1. **Nome:** `groom-guru-db`
2. **Database Password:** Crie uma senha forte (ANOTE!)
3. **Região:** Escolha a mais próxima
4. Clique em **"Create new project"**
5. Aguarde 2-3 minutos para criar

#### Passo 2.3: Obter String de Conexão

1. No dashboard, vá em **Settings** → **Database**
2. Role até **Connection Pooling**
3. Copie a string do modo **Transaction**
4. **Formato:**
   ```
   postgresql://postgres.PROJECT_REF:SENHA@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

**✅ ANOTE ESSA STRING!**

---

## 3. Configurar Backend no Railway

### Passo 3.1: Criar Conta no Railway

1. Acesse: https://railway.app
2. Clique em **"Login"** → **"GitHub"**
3. Autorize o Railway

### Passo 3.2: Criar Novo Projeto

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório: `groom-guru-platform`
4. Railway vai detectar automaticamente

### Passo 3.3: Configurar Root Directory

1. No projeto criado, vá em **Settings** → **Service**
2. Role até **Root Directory**
3. Digite: `backend`
4. Clique em **"Save"**

### Passo 3.4: Adicionar Variáveis de Ambiente

1. Vá em **Settings** → **Variables**
2. Clique em **"+ New Variable"**

**Adicione estas variáveis (uma por uma):**

**Variável 1:**
- Name: `DATABASE_URL`
- Value: Cole a string de conexão que você copiou (Neon ou Supabase)
- Clique em **"Add"**

**Variável 2:**
- Name: `JWT_SECRET`
- Value: `c6cf108f-35cf-43b0-b065-56861713a158`
- Clique em **"Add"**

**Variável 3:**
- Name: `SESSION_SECRET`
- Value: `c6cf108f-35cf-43b0-b065-56861713a158`
- Clique em **"Add"**

**Variável 4:**
- Name: `NODE_ENV`
- Value: `production`
- Clique em **"Add"**

**Variável 5:**
- Name: `FRONTEND_URL`
- Value: `https://groom-guru-platform.vercel.app`
- Clique em **"Add"**

**✅ Você deve ter 5 variáveis configuradas!**

### Passo 3.5: Gerar Domínio Público

1. Vá em **Settings** → **Networking**
2. Clique em **"Generate Domain"**
3. Railway vai gerar uma URL como: `https://groom-guru-platform-production.up.railway.app`
4. **✅ COPIE ESSA URL! Você vai precisar dela.**

### Passo 3.6: Aguardar Deploy

1. Vá em **Deployments**
2. Aguarde o status ficar **"SUCCESS"** (verde)
3. Pode levar 3-5 minutos

### Passo 3.7: Executar Migrações

Após o deploy, você precisa criar as tabelas no banco:

**Opção 1: Via Terminal Local**

1. Crie o arquivo `backend/.env`:
```env
DATABASE_URL="sua-string-de-conexao-aqui"
```

2. No terminal, dentro da pasta `backend`:
```bash
cd backend
npm install
npm run prisma:push
```

**Opção 2: Via Railway CLI**

Se tiver Railway CLI instalado:
```bash
railway run npx prisma db push
```

### Passo 3.8: Testar Backend

1. Abra no navegador: `https://sua-url.railway.app/api/health`
2. Deve retornar JSON com `"status": "API is running"`

**✅ Se funcionar, o backend está OK!**

---

## 4. Configurar Frontend no Vercel

### Passo 4.1: Acessar Vercel

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Vá em **"Add New"** → **"Project"**
4. Selecione o repositório: `groom-guru-platform`

### Passo 4.2: Configurar Build

1. **Framework Preset:** Vite
2. **Root Directory:** Deixe vazio (raiz do projeto)
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`

### Passo 4.3: Adicionar Variável de Ambiente

1. Antes de fazer deploy, clique em **"Environment Variables"**
2. Clique em **"+ Add"**

**Variável:**
- Name: `VITE_API_URL`
- Value: `https://sua-url.railway.app/api` (use a URL do Railway que você copiou)
- Marque: **Production**, **Preview**, **Development**
- Clique em **"Add"**

**✅ IMPORTANTE:** 
- Use a URL do Railway que você copiou no Passo 3.5
- Adicione `/api` no final
- **NÃO** coloque barra no final da URL

### Passo 4.4: Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. Vercel vai gerar uma URL como: `https://groom-guru-platform.vercel.app`

**✅ COPIE ESSA URL!**

### Passo 4.5: Atualizar FRONTEND_URL no Railway

1. Volte no Railway
2. Vá em **Settings** → **Variables**
3. Encontre `FRONTEND_URL`
4. Edite e cole a URL do Vercel (ex: `https://groom-guru-platform.vercel.app`)
5. Salve
6. Railway vai fazer redeploy automaticamente

---

## 5. Testar Tudo

### Teste 1: Health Check do Backend

1. Abra: `https://sua-url.railway.app/api/health`
2. Deve retornar: `{"status": "API is running", ...}`

### Teste 2: Frontend

1. Abra: `https://groom-guru-platform.vercel.app`
2. Tente fazer cadastro de dono
3. Tente fazer cadastro de cliente
4. Tente fazer login

### Teste 3: Verificar Logs

**No Railway:**
- Vá em **Deployments** → Último deploy → **Logs**
- Deve ver: `✅ Prisma Client conectado ao banco de dados`
- Deve ver: `✅ Server is running on...`

**No Vercel:**
- Vá em **Deployments** → Último deploy → **Logs**
- Não deve ter erros de build

---

## ✅ Checklist Final

- [ ] Banco de dados criado (Neon ou Supabase)
- [ ] String de conexão copiada
- [ ] Railway configurado com 5 variáveis
- [ ] Root Directory = `backend` no Railway
- [ ] Domínio público gerado no Railway
- [ ] Migrações executadas (`npm run prisma:push`)
- [ ] Health check do backend funcionando
- [ ] Vercel configurado com `VITE_API_URL`
- [ ] `FRONTEND_URL` atualizado no Railway
- [ ] Frontend fazendo deploy com sucesso
- [ ] Cadastro e login funcionando

---

## 🆘 Se Algo Não Funcionar

### Erro: "Cannot connect to database"
- Verifique se a `DATABASE_URL` está correta no Railway
- Verifique se o banco está ativo (não pausado)
- Para Supabase: use Connection Pooling (porta 6543)

### Erro: "Failed to fetch" no frontend
- Verifique se `VITE_API_URL` está configurada no Vercel
- Verifique se a URL está correta (com `/api` no final)
- Faça redeploy do Vercel após adicionar variável

### Erro: "CORS policy"
- Verifique se `FRONTEND_URL` está configurada no Railway
- Verifique se a URL do Vercel está correta
- Faça redeploy do Railway após atualizar

---

## 📝 Resumo das URLs Necessárias

1. **URL do Backend (Railway):**
   - Exemplo: `https://groom-guru-platform-production.up.railway.app`
   - Use para: `VITE_API_URL` no Vercel (adicione `/api`)

2. **URL do Frontend (Vercel):**
   - Exemplo: `https://groom-guru-platform.vercel.app`
   - Use para: `FRONTEND_URL` no Railway

3. **String de Conexão do Banco:**
   - Neon: `postgresql://usuario:senha@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - Supabase: `postgresql://postgres.xxx:SENHA@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true`
   - Use para: `DATABASE_URL` no Railway

---

## 🎯 Recomendação Final

**Use Neon** porque:
- ✅ Mais espaço (3GB vs 500MB)
- ✅ Connection Pooling automático
- ✅ Mais fácil de configurar
- ✅ Interface moderna

**OU use Supabase** se preferir:
- ✅ Interface mais conhecida
- ✅ Mais documentação
- ✅ Dashboard mais completo

---

**Boa sorte! Siga os passos na ordem e me avise se precisar de ajuda em algum passo específico!** 🚀

