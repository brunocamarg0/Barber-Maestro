# 🔐 Variáveis de Ambiente - Guia Completo

## 📋 Variáveis para Railway (Backend)

### 1. DATABASE_URL

**Onde obter:**
- **Neon:** Após criar projeto, copie a Connection string
- **Supabase:** Settings → Database → Connection Pooling → Transaction mode

**Formato Neon:**
```
postgresql://usuario:senha@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**Formato Supabase (Connection Pooling):**
```
postgresql://postgres.PROJECT_REF:SENHA@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Exemplo real Supabase:**
```
postgresql://postgres.zozmkzcuulgwjbbpgple:1hoPO26EVLSTW5Uz@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Onde configurar:** Railway → Settings → Variables

---

### 2. JWT_SECRET

**Valor:**
```
c6cf108f-35cf-43b0-b065-56861713a158
```

**O que é:** Chave secreta para gerar tokens JWT (autenticação)

**Onde configurar:** Railway → Settings → Variables

---

### 3. SESSION_SECRET

**Valor:**
```
c6cf108f-35cf-43b0-b065-56861713a158
```

**O que é:** Chave secreta para sessões (OAuth)

**Onde configurar:** Railway → Settings → Variables

---

### 4. NODE_ENV

**Valor:**
```
production
```

**O que é:** Ambiente de execução (production/development)

**Onde configurar:** Railway → Settings → Variables

---

### 5. FRONTEND_URL

**Valor:**
```
https://groom-guru-platform.vercel.app
```

**⚠️ IMPORTANTE:** 
- Use a URL do seu frontend no Vercel
- Pode ser diferente se você tiver outro domínio
- **NÃO** coloque barra no final

**Onde configurar:** Railway → Settings → Variables

**Quando configurar:** Depois de fazer deploy no Vercel e obter a URL

---

## 📋 Variáveis para Vercel (Frontend)

### 1. VITE_API_URL

**Valor:**
```
https://groom-guru-platform-production.up.railway.app/api
```

**⚠️ IMPORTANTE:**
- Use a URL do seu backend no Railway
- Adicione `/api` no final
- **NÃO** coloque barra no final

**Onde configurar:** Vercel → Settings → Environment Variables

**Quando configurar:** Depois de fazer deploy no Railway e obter a URL

---

## 📝 Resumo Rápido

### Railway (Backend) - 5 Variáveis:

| Nome | Valor | Onde Obter |
|------|-------|------------|
| `DATABASE_URL` | String de conexão | Neon ou Supabase |
| `JWT_SECRET` | `c6cf108f-35cf-43b0-b065-56861713a158` | Fixo |
| `SESSION_SECRET` | `c6cf108f-35cf-43b0-b065-56861713a158` | Fixo |
| `NODE_ENV` | `production` | Fixo |
| `FRONTEND_URL` | URL do Vercel | Após deploy no Vercel |

### Vercel (Frontend) - 1 Variável:

| Nome | Valor | Onde Obter |
|------|-------|------------|
| `VITE_API_URL` | URL do Railway + `/api` | Após deploy no Railway |

---

## 🔄 Ordem de Configuração

### Passo 1: Configurar Railway (Backend)

1. ✅ `DATABASE_URL` - Obter do banco de dados
2. ✅ `JWT_SECRET` - Valor fixo
3. ✅ `SESSION_SECRET` - Valor fixo
4. ✅ `NODE_ENV` - `production`
5. ⏳ `FRONTEND_URL` - Deixar para depois

### Passo 2: Fazer Deploy no Railway

- Aguardar deploy concluir
- Copiar URL gerada (ex: `https://groom-guru-platform-production.up.railway.app`)

### Passo 3: Configurar Vercel (Frontend)

1. ✅ `VITE_API_URL` - URL do Railway + `/api`

### Passo 4: Fazer Deploy no Vercel

- Aguardar deploy concluir
- Copiar URL gerada (ex: `https://groom-guru-platform.vercel.app`)

### Passo 5: Atualizar Railway

1. ✅ `FRONTEND_URL` - URL do Vercel

---

## 📋 Exemplo Completo

### Railway - Todas as Variáveis:

```
DATABASE_URL = postgresql://usuario:senha@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET = c6cf108f-35cf-43b0-b065-56861713a158
SESSION_SECRET = c6cf108f-35cf-43b0-b065-56861713a158
NODE_ENV = production
FRONTEND_URL = https://groom-guru-platform.vercel.app
```

### Vercel - Variável:

```
VITE_API_URL = https://groom-guru-platform-production.up.railway.app/api
```

---

## ⚠️ Importante

1. **Não coloque espaços** antes ou depois dos valores
2. **Não coloque aspas** nos valores (Railway/Vercel adicionam automaticamente)
3. **DATABASE_URL** deve ser a string completa, sem quebras de linha
4. **URLs** não devem ter barra no final (exceto `/api` no `VITE_API_URL`)
5. **Sempre faça redeploy** após adicionar/alterar variáveis

---

## 🔍 Como Verificar se Está Correto

### Railway:
1. Vá em Settings → Variables
2. Deve ter exatamente **5 variáveis**
3. Clique em cada uma para verificar o valor

### Vercel:
1. Vá em Settings → Environment Variables
2. Deve ter exatamente **1 variável** (`VITE_API_URL`)
3. Verifique se está marcada para Production, Preview e Development

---

## 🆘 Problemas Comuns

### Erro: "DATABASE_URL não configurada"
- Verifique se adicionou no Railway
- Verifique se não tem espaços extras
- Faça redeploy do Railway

### Erro: "Failed to fetch" no frontend
- Verifique se `VITE_API_URL` está no Vercel
- Verifique se a URL está correta (com `/api`)
- Faça redeploy do Vercel

### Erro: "CORS policy"
- Verifique se `FRONTEND_URL` está no Railway
- Verifique se a URL do Vercel está correta
- Faça redeploy do Railway

---

**Todas as informações necessárias estão aqui!** 🚀

