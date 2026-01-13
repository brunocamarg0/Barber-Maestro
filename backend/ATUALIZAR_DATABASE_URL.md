# 🔧 Atualizar DATABASE_URL e Executar Migrações

## 📋 Passo a Passo

### Passo 1: Obter DATABASE_URL do Railway

1. Acesse: https://railway.app
2. Abra seu projeto
3. Vá em **Settings** → **Variables**
4. Encontre `DATABASE_URL`
5. **Clique no valor** para revelar (pode estar oculto)
6. **Copie a string completa**

**Formato esperado:**
- **Neon:** `postgresql://usuario:senha@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
- **Supabase:** `postgresql://postgres.xxx:SENHA@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true`

---

### Passo 2: Atualizar arquivo .env

**Opção A: Manualmente**

1. Abra o arquivo `backend/.env`
2. Encontre a linha `DATABASE_URL=...`
3. Substitua pelo valor copiado do Railway
4. Salve o arquivo

**Opção B: Via Script (PowerShell)**

1. No terminal, dentro da pasta `backend`:
```powershell
.\atualizar-database-url.ps1
```
2. Cole a string quando solicitado

---

### Passo 3: Executar Migrações

No terminal, dentro da pasta `backend`:

```bash
npm run prisma:push
```

**Você deve ver:**
```
Your database is now in sync with your Prisma schema. Done in X.XXs
✔ Generated Prisma Client
```

---

### Passo 4: Testar

1. Teste o cadastro no frontend
2. Deve funcionar agora!

---

## ⚠️ Importante

- Use a **mesma string** que está configurada no Railway
- Não altere nada na string, copie exatamente como está
- Após atualizar, execute `npm run prisma:push`

---

**Siga os passos e me avise quando terminar!** 🚀

