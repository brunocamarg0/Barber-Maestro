# 🚀 Como Fazer Deploy do Backend na Vercel

## ✅ Solução: Backend na Nuvem (Não Precisa Rodar Localmente!)

### Por Que Fazer Deploy?

**Problema Atual:**
- ❌ Backend precisa rodar no seu computador
- ❌ Só funciona quando você roda `npm run dev`
- ❌ Para quando você fecha o terminal

**Solução:**
- ✅ Backend na nuvem (Vercel)
- ✅ Sempre online (24/7)
- ✅ Não precisa rodar nada localmente
- ✅ Gratuito para começar

---

## 📋 Passo a Passo para Deploy

### 1. Instalar Dependência do Vercel

```bash
npm install @vercel/node --save-dev
```

### 2. Fazer Build do Backend

```bash
cd backend
npm run build
```

### 3. Fazer Deploy na Vercel

**Opção A: Via CLI (Mais Fácil)**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

**Opção B: Via Dashboard (Recomendado)**

1. Acesse: https://vercel.com
2. Conecte seu repositório GitHub
3. Configure:
   - **Root Directory:** Deixe como está (raiz do projeto)
   - **Build Command:** `cd backend && npm run build`
   - **Output Directory:** `backend/dist`
   - **Install Command:** `cd backend && npm install`

### 4. Configurar Variáveis de Ambiente na Vercel

No dashboard da Vercel, vá em **Settings** → **Environment Variables** e adicione:

```
DATABASE_URL=postgresql://postgres:1hoPO26EVLSTW5Uz@db.zozmkzcuulgwjbbpgple.supabase.co:5432/postgres
JWT_SECRET=c6cf108f-35cf-43b0-b065-56861713a158
SESSION_SECRET=c6cf108f-35cf-43b0-b065-56861713a158
NODE_ENV=production
```

**Importante:** Marque para **Production**, **Preview** e **Development**!

### 5. Atualizar Frontend para Usar API na Nuvem

Crie arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://seu-projeto.vercel.app/api
```

Ou atualize no código:

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'https://seu-projeto.vercel.app/api';
```

### 6. Fazer Redeploy

Após configurar tudo, faça um novo deploy na Vercel.

---

## ✅ Depois do Deploy

1. **Backend estará online:** `https://seu-projeto.vercel.app/api`
2. **Teste:** `https://seu-projeto.vercel.app/api/health`
3. **Frontend funcionará** sem precisar rodar backend localmente!

---

## 🎯 Alternativa Mais Simples: Railway

Se a Vercel der muito trabalho, use **Railway**:

1. Acesse: https://railway.app
2. Conecte GitHub
3. Crie novo projeto → Deploy do GitHub
4. Selecione a pasta `backend`
5. Configure variáveis de ambiente
6. Deploy automático!

**Railway é mais simples para backends Express!**

---

## 💡 Qual Você Prefere?

**A) Vercel** - Mesma plataforma do frontend
**B) Railway** - Mais simples para Express
**C) Continuar Local** - Para desenvolvimento

**Me diga qual você prefere e eu ajudo a configurar!** 🚀

