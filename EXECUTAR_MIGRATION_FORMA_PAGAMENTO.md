# 🚨 IMPORTANTE: Executar Migration da Coluna formaPagamento

O erro que você está vendo é porque a coluna `formaPagamento` foi adicionada ao schema do Prisma, mas a migration ainda não foi executada no banco de dados de produção.

## ❌ Erro Atual

```
The column `Agendamento.formaPagamento` does not exist in the current database.
```

## ✅ Solução Temporária

O código foi atualizado para funcionar **mesmo sem a coluna**, mas você ainda precisa executar a migration para que o sistema funcione completamente.

---

## 🚀 Como Executar a Migration

### Opção 1: Via Railway CLI (Recomendado)

1. **Instale o Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Faça login:**
   ```bash
   railway login
   ```

3. **Conecte ao projeto:**
   ```bash
   railway link
   ```

4. **Execute a migration:**
   ```bash
   cd backend
   railway run npx prisma migrate deploy
   ```

   Isso executará todas as migrations pendentes, incluindo a que adiciona `formaPagamento`.

---

### Opção 2: Via SQL Direto no Banco

Se você tem acesso direto ao banco de dados:

```sql
ALTER TABLE "Agendamento" ADD COLUMN IF NOT EXISTS "formaPagamento" TEXT;
```

**Onde executar:**
- **Supabase:** SQL Editor no dashboard
- **Neon:** SQL Editor no dashboard
- **Railway:** Via Railway CLI ou cliente SQL

---

### Opção 3: Via Railway Dashboard

1. **Acesse:** https://railway.app
2. **Abra seu projeto** do backend
3. **Vá em "Deployments"**
4. **Clique em "Redeploy"** ou force um novo deploy
5. A migration será executada automaticamente se estiver configurada no `nixpacks.toml`

---

## 📋 Migration que Precisa ser Executada

A migration está em:
```
backend/prisma/migrations/20250113000000_add_mercado_pago_fields/migration.sql
```

Conteúdo:
```sql
-- AlterTable: Adicionar campo formaPagamento ao Agendamento
ALTER TABLE "Agendamento" ADD COLUMN IF NOT EXISTS "formaPagamento" TEXT;
```

---

## ✅ Verificar se Funcionou

Após executar a migration, verifique:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Agendamento' AND column_name = 'formaPagamento';
```

Se retornar uma linha, a coluna foi criada! ✅

---

## 🔄 Após Executar a Migration

1. **Teste criar um agendamento** novamente
2. **O erro deve desaparecer**
3. **O sistema de pagamento funcionará completamente**

---

## ⚠️ Nota

O código foi atualizado para funcionar **temporariamente** sem a coluna, mas algumas funcionalidades de pagamento podem não funcionar completamente até a migration ser executada.

---

**Execute a migration o quanto antes para ter todas as funcionalidades disponíveis!** 🚀

