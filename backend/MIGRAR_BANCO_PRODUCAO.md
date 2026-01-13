# 🗄️ Migrar Banco de Dados em Produção

## ⚠️ Problema

As tabelas foram criadas **localmente**, mas o banco de dados em **produção (Railway)** ainda não tem as tabelas.

---

## ✅ Solução: Executar Migrações no Banco de Produção

### Opção 1: Via Railway CLI (Recomendado)

Se você tiver Railway CLI instalado:

```bash
railway run npx prisma db push
```

Isso executará as migrações no banco de produção.

---

### Opção 2: Atualizar .env Local com DATABASE_URL de Produção

1. **Copie a `DATABASE_URL` do Railway:**
   - No Railway, vá em **Settings** → **Variables**
   - Copie o valor de `DATABASE_URL`

2. **Atualize o arquivo `backend/.env`:**
   ```env
   DATABASE_URL="cole-a-string-do-railway-aqui"
   ```

3. **Execute as migrações:**
   ```bash
   cd backend
   npm run prisma:push
   ```

**⚠️ IMPORTANTE:** Isso vai criar as tabelas no banco de **produção**!

---

### Opção 3: Executar via Script no Railway

Podemos adicionar um script que executa as migrações automaticamente no deploy.

---

## 🔍 Verificar se Funcionou

Após executar, teste o cadastro novamente no frontend. O erro "Tabelas não criadas" não deve mais aparecer.

---

## 📋 Passo a Passo Detalhado

### 1. Obter DATABASE_URL do Railway

1. Acesse: https://railway.app
2. Abra seu projeto
3. Vá em **Settings** → **Variables**
4. Encontre `DATABASE_URL`
5. **Clique para ver o valor** (pode estar oculto)
6. **Copie a string completa**

### 2. Atualizar .env Local

1. Abra o arquivo `backend/.env`
2. Substitua o valor de `DATABASE_URL` pela string do Railway
3. Salve o arquivo

### 3. Executar Migrações

```bash
cd backend
npm run prisma:push
```

### 4. Testar

1. Teste o cadastro no frontend
2. Deve funcionar agora!

---

**Execute as migrações no banco de produção e me avise se funcionou!** 🚀

