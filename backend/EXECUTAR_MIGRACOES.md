# 🗄️ Executar Migrações do Prisma no Banco de Dados

## ⚠️ Problema

O banco de dados Supabase está conectado, mas as **tabelas não foram criadas**. O erro indica que a coluna `horario` não existe porque a tabela `Agendamento` não existe.

## ✅ Solução: Executar Migrações

Você precisa executar as migrações do Prisma para criar todas as tabelas no banco de dados.

---

## 📋 Opção 1: Executar Localmente (Recomendado)

### Passo 1: Configurar DATABASE_URL localmente

1. Crie/edite o arquivo `backend/.env`:
```env
DATABASE_URL="postgresql://postgres.zozmkzcuulgwjbbpgple:SENHA@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Substitua:**
- `SENHA` pela sua senha real do Supabase
- `us-west-1` pela região do seu projeto (se diferente)

### Passo 2: Executar migrações

No terminal, dentro da pasta `backend`:

```bash
cd backend
npm install
npx prisma migrate deploy
```

**OU** se não tiver migrações criadas:

```bash
npx prisma db push
```

### Passo 3: Verificar

Após executar, as tabelas devem estar criadas. Você pode verificar no Supabase:
1. Acesse: https://supabase.com/dashboard
2. Vá em **Table Editor**
3. Deve ver todas as tabelas criadas

---

## 📋 Opção 2: Executar via Railway (Script)

### Passo 1: Adicionar script no package.json

Já existe um script `prisma:push` no `package.json`. Você pode executar via Railway CLI ou adicionar ao processo de deploy.

### Passo 2: Executar via Railway CLI

Se tiver Railway CLI instalado:

```bash
railway run npx prisma db push
```

---

## 📋 Opção 3: Adicionar ao Deploy (Automático)

Podemos modificar o `railway.toml` ou `nixpacks.toml` para executar as migrações automaticamente no deploy.

---

## 🔍 Verificar se Funcionou

Após executar as migrações, nos logs do Railway você deve ver:

```
✅ Prisma Client conectado ao banco de dados
```

E **não** deve mais aparecer:

```
❌ Erro: The column `Agendamento.horario` does not exist
```

---

## ⚠️ Importante

- Use a string de conexão com **pooling** (porta 6543)
- Não use a conexão direta (porta 5432) para migrações
- Certifique-se de que o Supabase está **ativo** (não pausado)

