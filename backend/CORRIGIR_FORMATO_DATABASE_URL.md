# 🔧 Corrigir Erro: "Tenant or user not found"

## ❌ Erro Atual

```
FATAL: Tenant or user not found
```

## ✅ Significado

A conexão **está chegando** ao Supabase, mas o **formato do usuário** está incorreto.

---

## 🔍 Formato Correto da String de Conexão

### Para Connection Pooling (Transaction Mode):

```
postgresql://postgres.PROJECT_REF:SENHA@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Onde:**
- `PROJECT_REF` = Referência do seu projeto (ex: `zozmkzcuulgwjbbpgple`)
- `SENHA` = Sua senha do banco de dados
- `REGION` = Região do seu projeto (ex: `us-west-1`, `sa-east-1`)

---

## 📋 Passo a Passo para Obter a String Correta

### 1. No Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto: `zozmkzcuulgwjbbpgple`
3. Vá em **Settings** → **Database**
4. Role até **Connection Pooling**
5. **IMPORTANTE:** Use o modo **Transaction** (não Session)
6. Copie a string de conexão completa

### 2. Verificar o Formato

A string deve ter este formato:

```
postgresql://postgres.zozmkzcuulgwjbbpgple:SENHA@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Verifique:**
- ✅ Usuário: `postgres.zozmkzcuulgwjbbpgple` (com ponto entre postgres e project_ref)
- ✅ Host: `aws-0-REGION.pooler.supabase.com` (não `db.xxxxx.supabase.co`)
- ✅ Porta: `6543` (não `5432`)
- ✅ Parâmetro: `?pgbouncer=true` no final

### 3. Se Não Tiver Connection Pooling Habilitado

Se não aparecer Connection Pooling no dashboard:

1. Vá em **Settings** → **Database**
2. Procure por **Connection string** (modo direto)
3. Use esta string como base e modifique:

**String direta:**
```
postgresql://postgres:SENHA@db.zozmkzcuulgwjbbpgple.supabase.co:5432/postgres
```

**Converta para pooling:**
```
postgresql://postgres.zozmkzcuulgwjbbpgple:SENHA@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Mudanças:**
- `postgres` → `postgres.zozmkzcuulgwjbbpgple`
- `db.zozmkzcuulgwjbbpgple.supabase.co` → `aws-0-us-west-1.pooler.supabase.com`
- `5432` → `6543`
- Adicione `?pgbouncer=true` no final

---

## 🚨 Região do Projeto

A região pode variar. Verifique no Supabase:

1. **Settings** → **General**
2. Veja a **região** do projeto
3. Ajuste o host na string:
   - `us-west-1` → `aws-0-us-west-1.pooler.supabase.com`
   - `sa-east-1` → `aws-0-sa-east-1.pooler.supabase.com`
   - `eu-west-1` → `aws-0-eu-west-1.pooler.supabase.com`

---

## ✅ Atualizar no Railway

1. Acesse: https://railway.app
2. Abra seu projeto
3. Vá em **Settings** → **Variables**
4. Encontre `DATABASE_URL`
5. **Edite** e cole a string correta (com pooling)
6. **Salve**
7. Aguarde redeploy (2-3 minutos)

---

## 🔍 Exemplo Completo

Baseado nas suas informações:

```
postgresql://postgres.zozmkzcuulgwjbbpgple:1hoPO26EVLSTW5Uz@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Se sua região for diferente, ajuste:**
- `us-west-1` → sua região
- `1hoPO26EVLSTW5Uz` → sua senha real

---

## ❓ Ainda Não Funciona?

1. Verifique se copiou a string **completa** do Supabase
2. Verifique se não há **espaços extras** no início/fim
3. Verifique se a **região** está correta
4. Tente usar a string de **Session** mode se Transaction não funcionar

