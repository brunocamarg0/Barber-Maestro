# 🗄️ Executar Migrações AGORA

## ⚠️ Erro: "Tabelas não criadas no banco de dados"

Isso significa que você precisa executar as migrações para criar as tabelas no banco de dados.

---

## 📋 Passo a Passo

### Passo 1: Criar arquivo `.env` no backend

1. Vá para a pasta `backend`:
```bash
cd backend
```

2. Crie o arquivo `.env` (se não existir):
```env
DATABASE_URL="sua-string-de-conexao-aqui"
```

**Onde obter a string de conexão:**
- **Neon:** Copie a Connection string do dashboard
- **Supabase:** Settings → Database → Connection Pooling → Transaction mode

**Exemplo Neon:**
```
postgresql://usuario:senha@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**Exemplo Supabase (Connection Pooling):**
```
postgresql://postgres.PROJECT_REF:SENHA@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Passo 2: Executar migrações

No terminal, dentro da pasta `backend`:

```bash
npm install
npm run prisma:push
```

**Você deve ver:**
```
Your database is now in sync with your Prisma schema. Done in X.XXs
✔ Generated Prisma Client
```

**✅ Se aparecer isso, as tabelas foram criadas!**

---

## 🔍 Verificar se Funcionou

### No Neon:
1. Acesse: https://console.neon.tech
2. Abra seu projeto
3. Vá em **SQL Editor**
4. Execute: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
5. Deve listar todas as tabelas

### No Supabase:
1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto
3. Vá em **Table Editor**
4. Deve ver todas as tabelas criadas (Agendamento, Cliente, Barbearia, etc.)

---

## ✅ Após Executar

1. Teste o cadastro novamente no frontend
2. Deve funcionar agora!

---

## 🆘 Se Der Erro

### Erro: "Cannot connect to database"
- Verifique se a `DATABASE_URL` está correta no arquivo `.env`
- Verifique se o banco está ativo (não pausado)
- Para Supabase: use Connection Pooling (porta 6543)

### Erro: "npx não é reconhecido"
- Use: `npm run prisma:push` (ao invés de `npx prisma db push`)

---

**Execute as migrações e me avise se funcionou!** 🚀

