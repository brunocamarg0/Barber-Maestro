# 🚀 Próximos Passos Após Configuração

## ✅ Checklist: Você já fez?

- [ ] Banco de dados criado (Neon ou Supabase)
- [ ] Railway configurado com 5 variáveis
- [ ] Root Directory = `backend` no Railway
- [ ] Domínio público gerado no Railway
- [ ] Vercel configurado com `VITE_API_URL`
- [ ] `FRONTEND_URL` atualizado no Railway
- [ ] Deploys concluídos (Railway e Vercel)

---

## 📋 Passo 1: Executar Migrações do Banco de Dados

As migrações criam todas as tabelas no banco de dados.

### Opção A: Executar Localmente (Recomendado)

1. **Crie o arquivo `backend/.env`:**

No terminal, dentro da pasta `backend`:

```bash
cd backend
```

Crie o arquivo `.env` com:

```env
DATABASE_URL="sua-string-de-conexao-aqui"
```

**Substitua `sua-string-de-conexao-aqui` pela string de conexão do seu banco (Neon ou Supabase).**

2. **Execute as migrações:**

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

### Opção B: Verificar se as Tabelas Foram Criadas

**No Neon:**
1. Acesse: https://console.neon.tech
2. Abra seu projeto
3. Vá em **SQL Editor**
4. Execute: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
5. Deve listar todas as tabelas (Agendamento, Cliente, Barbearia, etc.)

**No Supabase:**
1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto
3. Vá em **Table Editor**
4. Deve ver todas as tabelas criadas

---

## 📋 Passo 2: Verificar se Backend Está Funcionando

### Teste 1: Health Check

1. Abra no navegador: `https://sua-url-railway.app/api/health`

**Deve retornar:**
```json
{
  "status": "API is running",
  "timestamp": "...",
  "environment": "production",
  "port": "8080"
}
```

**✅ Se retornar isso, o backend está funcionando!**

---

### Teste 2: Verificar Logs do Railway

1. No Railway, vá em **Deployments**
2. Clique no último deploy
3. Vá em **Logs**

**Você deve ver:**
```
✅ Prisma Client conectado ao banco de dados
✅ Server is running on http://0.0.0.0:8080
✅ Health check endpoint ready at /api/health
```

**❌ Se aparecer erro de conexão com banco:**
- Verifique se `DATABASE_URL` está correta no Railway
- Verifique se o banco está ativo (não pausado)

---

## 📋 Passo 3: Verificar se Frontend Está Funcionando

### Teste 1: Acessar Frontend

1. Abra no navegador: `https://groom-guru-platform.vercel.app`
2. Deve carregar a página inicial

**✅ Se carregar, o frontend está funcionando!**

---

### Teste 2: Verificar Console do Navegador

1. Abra o frontend
2. Pressione **F12** (abrir DevTools)
3. Vá na aba **Console**

**Você deve ver:**
```
🔍 API_URL configurada: https://sua-url-railway.app/api
```

**❌ Se aparecer erro:**
- Verifique se `VITE_API_URL` está configurada no Vercel
- Faça redeploy do Vercel

---

## 📋 Passo 4: Testar Cadastro e Login

### Teste 1: Cadastro de Dono

1. Acesse: `https://groom-guru-platform.vercel.app/cadastro?tipo=dono`
2. Preencha o formulário:
   - Nome da Barbearia
   - Nome do Contato
   - Telefone
   - Email
   - Senha (6-15 caracteres)
3. Aceite os termos
4. Clique em **"Cadastrar"**

**✅ Se funcionar:**
- Deve redirecionar para `/dono`
- Deve mostrar mensagem de sucesso

**❌ Se aparecer erro:**
- Abra o console (F12) e veja o erro
- Verifique os logs do Railway

---

### Teste 2: Cadastro de Cliente

1. Acesse: `https://groom-guru-platform.vercel.app/cadastro?tipo=cliente`
2. Preencha o formulário:
   - Nome
   - Email
   - Senha (mínimo 6 caracteres)
   - Telefone (opcional)
   - Data de Nascimento (opcional)
3. Aceite os termos
4. Clique em **"Cadastrar"**

**✅ Se funcionar:**
- Deve redirecionar para `/client`
- Deve mostrar mensagem de sucesso

---

### Teste 3: Login

1. Acesse: `https://groom-guru-platform.vercel.app/login`
2. Escolha a aba (Dono ou Cliente)
3. Digite email e senha
4. Clique em **"Entrar"**

**✅ Se funcionar:**
- Deve redirecionar para o painel correspondente
- Deve salvar token no localStorage

---

## 📋 Passo 5: Verificar se Tudo Está OK

### Checklist Final:

- [ ] Migrações executadas (tabelas criadas)
- [ ] Health check do backend funcionando
- [ ] Logs do Railway sem erros
- [ ] Frontend carregando corretamente
- [ ] Console do navegador sem erros
- [ ] Cadastro de dono funcionando
- [ ] Cadastro de cliente funcionando
- [ ] Login funcionando

---

## 🆘 Se Algo Não Funcionar

### Erro: "Cannot connect to database"

**Solução:**
1. Verifique se `DATABASE_URL` está correta no Railway
2. Verifique se o banco está ativo (não pausado)
3. Para Supabase: use Connection Pooling (porta 6543)

---

### Erro: "Failed to fetch" no frontend

**Solução:**
1. Verifique se `VITE_API_URL` está no Vercel
2. Verifique se a URL está correta (com `/api`)
3. Faça redeploy do Vercel
4. Verifique se o backend está online (teste `/api/health`)

---

### Erro: "CORS policy"

**Solução:**
1. Verifique se `FRONTEND_URL` está no Railway
2. Verifique se a URL do Vercel está correta
3. Faça redeploy do Railway

---

### Erro: "The column does not exist"

**Solução:**
- Execute as migrações: `npm run prisma:push` (localmente)

---

## 🎯 Próximos Passos Após Tudo Funcionar

1. **Testar todas as funcionalidades:**
   - Cadastro de dono ✅
   - Cadastro de cliente ✅
   - Login ✅
   - Painel do dono
   - Painel do cliente

2. **Configurar OAuth (Opcional):**
   - Adicionar `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no Railway
   - Configurar callbacks no Google Cloud Console

3. **Configurar Email (Opcional):**
   - Adicionar variáveis de email no Railway
   - Configurar SMTP

4. **Configurar WhatsApp (Opcional):**
   - Adicionar variáveis de WhatsApp no Railway
   - Configurar provedor (Twilio, Evolution API, etc.)

---

## ✅ Tudo Funcionando?

**Parabéns! 🎉**

Seu sistema está pronto para uso! Você pode:
- Cadastrar novos donos de barbearia
- Cadastrar novos clientes
- Fazer login
- Usar os painéis

**Me avise se tudo funcionou ou se encontrou algum problema!** 🚀

