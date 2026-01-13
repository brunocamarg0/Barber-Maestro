# 🚂 Passo a Passo Railway - Do Passo 3 em Diante

## ✅ Você já fez:
- [x] Passo 1: Criar conta no Railway
- [x] Passo 2: Criar novo projeto

---

## 📋 Passo 3: Configurar Deploy

### 3.1. Selecionar Repositório

Quando você clicar em "Deploy from GitHub repo", o Railway vai mostrar seus repositórios.

1. **Procure:** `groom-guru-platform` (ou o nome do seu repositório)
2. **Clique** no repositório
3. Railway vai perguntar: **"Configure your project"**

### 3.2. Configurar Pasta do Backend

O Railway pode detectar automaticamente, mas você precisa garantir:

1. **Root Directory:** Deixe vazio ou digite: `backend`
2. **Ou** depois do deploy, vá em **Settings** → **Service** → **Root Directory** → Digite: `backend`

### 3.3. Railway Vai Fazer Automaticamente:

- ✅ Detectar `package.json` na pasta `backend`
- ✅ Instalar dependências (`npm install`)
- ✅ Fazer build (`npm run build`)
- ✅ Iniciar servidor (`npm start`)

**Aguarde alguns minutos** enquanto o Railway faz o deploy!

---

## 📋 Passo 4: Configurar Variáveis de Ambiente

### 4.1. Acessar Variáveis

1. No projeto Railway, clique em **"Variables"** (no menu lateral)
2. Ou clique no serviço → **"Variables"** tab

### 4.2. Adicionar Variáveis

Clique em **"+ New Variable"** e adicione uma por uma:

#### Variável 1: DATABASE_URL
- **Name:** `DATABASE_URL`
- **Value:** `postgresql://postgres:1hoPO26EVLSTW5Uz@db.zozmkzcuulgwjbbpgple.supabase.co:5432/postgres`
- Clique em **"Add"**

#### Variável 2: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** `c6cf108f-35cf-43b0-b065-56861713a158`
- Clique em **"Add"**

#### Variável 3: SESSION_SECRET
- **Name:** `SESSION_SECRET`
- **Value:** `c6cf108f-35cf-43b0-b065-56861713a158`
- Clique em **"Add"**

#### Variável 4: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- Clique em **"Add"**

#### Variável 5: PORT
- **Name:** `PORT`
- **Value:** `3001`
- Clique em **"Add"**

#### Variável 6: FRONTEND_URL
- **Name:** `FRONTEND_URL`
- **Value:** `https://groom-guru-platform.vercel.app`
- Clique em **"Add"**

### 4.3. Verificar Variáveis

Você deve ter 6 variáveis configuradas:
- ✅ DATABASE_URL
- ✅ JWT_SECRET
- ✅ SESSION_SECRET
- ✅ NODE_ENV
- ✅ PORT
- ✅ FRONTEND_URL

---

## 📋 Passo 5: Obter URL do Backend

### 5.1. Acessar Settings

1. No projeto Railway, clique em **"Settings"** (no menu lateral)
2. Role até a seção **"Networking"**

### 5.2. Gerar Domínio

1. Clique em **"Generate Domain"**
2. Railway vai criar uma URL como: `https://groom-guru-backend-production.up.railway.app`
3. **COPIE ESSA URL!** Você vai precisar dela

### 5.3. Anotar URL

**Exemplo de URL:** `https://groom-guru-backend-production.up.railway.app`

**Anote em algum lugar seguro!**

---

## 📋 Passo 6: Testar o Backend

### 6.1. Aguardar Deploy

1. No Railway, vá em **"Deployments"** (no menu lateral)
2. Aguarde o status ficar **"SUCCESS"** (verde)
3. Pode levar 2-5 minutos

### 6.2. Testar Health Check

1. Abra uma nova aba no navegador
2. Acesse: `https://sua-url.railway.app/api/health`
   - Substitua `sua-url.railway.app` pela URL que você copiou
3. Deve retornar:
   ```json
   {
     "status": "API is running",
     "timestamp": "2024-..."
   }
   ```

### 6.3. Se Der Erro

- **404 Not Found:** URL errada, verifique novamente
- **500 Error:** Variáveis de ambiente podem estar faltando
- **Timeout:** Aguarde mais alguns minutos

---

## 📋 Passo 7: Atualizar Frontend

### 7.1. Opção A: Variável de Ambiente na Vercel (Recomendado)

1. Acesse: **https://vercel.com/brunos-projects-9672b208/groom-guru-platform**
2. Clique em **"Settings"** (no menu superior)
3. Clique em **"Environment Variables"** (no menu lateral)
4. Clique em **"Add New"**
5. Preencha:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://sua-url.railway.app/api`
     - Substitua `sua-url.railway.app` pela URL do Railway
   - Marque todas as opções:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. Clique em **"Save"**

### 7.2. Fazer Redeploy do Frontend

1. Na Vercel, vá em **"Deployments"**
2. Clique nos **3 pontinhos** (⋯) do último deploy
3. Clique em **"Redeploy"**
4. Aguarde o deploy terminar (2-3 minutos)

### 7.3. Opção B: Atualizar Código (Alternativa)

Se preferir atualizar o código diretamente:

1. Edite `src/services/api.ts`
2. Mude a linha 1:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'https://sua-url.railway.app/api';
   ```
3. Faça commit e push
4. Vercel faz deploy automático

---

## 📋 Passo 8: Teste Final

### 8.1. Testar Cadastro

1. Acesse seu frontend: `https://groom-guru-platform.vercel.app`
2. Vá em **"Cadastro"** ou **"/cadastro?tipo=dono"**
3. Preencha o formulário:
   - Nome da Barbearia: "Teste"
   - Nome do contato: "Seu Nome"
   - Telefone: "19999999999"
   - Email: "teste@email.com"
   - Senha: "123456"
4. Clique em **"CADASTRAR"**
5. Deve funcionar! ✅

### 8.2. Verificar Logs (Se Der Erro)

**No Railway:**
1. Vá em **"Deployments"**
2. Clique no último deploy
3. Veja os **"Logs"** para identificar erros

**Na Vercel:**
1. Vá em **"Functions"**
2. Veja os logs das requisições

---

## ✅ Checklist Final

- [ ] Backend deployado no Railway
- [ ] Status: SUCCESS (verde)
- [ ] 6 variáveis de ambiente configuradas
- [ ] URL do backend obtida e anotada
- [ ] `/api/health` retorna `{"status": "API is running"}`
- [ ] Variável `VITE_API_URL` configurada na Vercel
- [ ] Frontend redeployado na Vercel
- [ ] Teste de cadastro funcionando

---

## 🆘 Se Algo Der Erro

### Erro: "Build failed"
- Verifique se todas as dependências estão no `package.json`
- Veja os logs no Railway para mais detalhes

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está correto
- Verifique se o Supabase está ativo

### Erro: "Port already in use"
- Railway define a porta automaticamente
- Não precisa configurar `PORT` manualmente (mas não faz mal)

### Erro: "Cannot find module"
- Railway deve instalar dependências automaticamente
- Se não instalar, adicione `npm install` no build command

---

## 🎯 Próximo Passo

Depois que tudo estiver funcionando:

1. ✅ Teste login
2. ✅ Teste cadastro de cliente
3. ✅ Teste criar cliente no painel do dono
4. ✅ Tudo funcionando = Sucesso! 🎉

---

**Siga esses passos e seu backend estará online!** 🚀

