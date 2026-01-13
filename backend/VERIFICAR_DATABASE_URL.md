# 🔍 Como Verificar se DATABASE_URL está Configurada no Railway

## ⚠️ Problema: Erro P1001 - Can't reach database server

Este erro significa que o Railway não consegue conectar ao Supabase.

---

## ✅ Passo 1: Verificar se DATABASE_URL está configurada

### No Railway:

1. Acesse: https://railway.app
2. Abra seu projeto
3. Vá em **Settings** → **Variables**
4. Procure por `DATABASE_URL`

**Você vê a variável `DATABASE_URL`?**
- [ ] Sim, está lá
- [ ] Não, não está lá

---

## ✅ Passo 2: Verificar o formato da DATABASE_URL

A string de conexão deve estar no formato:

```
postgresql://postgres:SENHA@db.zozmkzcuulgwjbbpgple.supabase.co:5432/postgres
```

**Onde:**
- `postgres` = usuário
- `SENHA` = sua senha do Supabase (sem colchetes)
- `db.zozmkzcuulgwjbbpgple.supabase.co` = host do Supabase
- `5432` = porta
- `postgres` = nome do banco

**Exemplo correto:**
```
postgresql://postgres:1hoPO26EVLSTW5Uz@db.zozmkzcuulgwjbbpgple.supabase.co:5432/postgres
```

---

## ✅ Passo 3: Verificar se o Supabase está ativo

### No Supabase:

1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto: `zozmkzcuulgwjbbpgple`
3. Vá em **Settings** → **Database**
4. Verifique se o banco está **ativo** (não pausado)

**O banco está pausado?**
- [ ] Sim, está pausado → Clique em "Resume" para ativar
- [ ] Não, está ativo

---

## ✅ Passo 4: Verificar Connection Pooling (IMPORTANTE!)

O Supabase pode exigir usar **Connection Pooling** em produção.

### String de conexão com Pooling:

```
postgresql://postgres.zozmkzcuulgwjbbpgple:1hoPO26EVLSTW5Uz@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**OU** use a porta de pooling direta:

No Supabase Dashboard:
1. Vá em **Settings** → **Database**
2. Role até **Connection Pooling**
3. Copie a string de conexão de **"Connection string"** (modo Transaction)
4. Use essa string no Railway

---

## ✅ Passo 5: Adicionar DATABASE_URL no Railway

### Se não tiver a variável:

1. No Railway, vá em **Settings** → **Variables**
2. Clique em **"+ New Variable"**
3. **Name:** `DATABASE_URL`
4. **Value:** Cole a string de conexão completa
5. Clique em **"Add"**
6. Aguarde o redeploy (2-3 minutos)

### Se já tiver a variável:

1. Clique na variável `DATABASE_URL`
2. Verifique se o valor está correto
3. Se estiver errado, edite e salve
4. Aguarde o redeploy

---

## ✅ Passo 6: Verificar após redeploy

Após o redeploy, nos logs do Railway você deve ver:

```
✅ Prisma Client conectado ao banco de dados
```

**Se ainda aparecer erro:**
- Verifique se o Supabase está ativo
- Tente usar a string de conexão com pooling
- Verifique se a senha está correta (sem espaços extras)

---

## 🔧 String de Conexão Completa (Exemplo)

Baseado nas informações fornecidas:

```
postgresql://postgres:1hoPO26EVLSTW5Uz@db.zozmkzcuulgwjbbpgple.supabase.co:5432/postgres
```

**OU com pooling (recomendado para produção):**

```
postgresql://postgres.zozmkzcuulgwjbbpgple:1hoPO26EVLSTW5Uz@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## ❓ Ainda não funciona?

1. Verifique se o Supabase está ativo (não pausado)
2. Tente usar a porta de pooling (6543) ao invés da direta (5432)
3. Verifique se não há espaços extras na string de conexão
4. Teste a conexão localmente primeiro

