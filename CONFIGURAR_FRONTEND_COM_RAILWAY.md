# ✅ Configurar Frontend com URL do Railway

## 🎉 URL do Backend Obtida!

Sua URL do Railway:
```
https://groom-guru-platform-production.up.railway.app
```

---

## 📋 Passo 1: Testar o Backend

### 1.1. Testar Health Check

1. Abra uma nova aba no navegador
2. Acesse: **https://groom-guru-platform-production.up.railway.app/api/health**
3. Deve retornar:
   ```json
   {
     "status": "API is running",
     "timestamp": "2024-..."
   }
   ```

✅ **Se retornar isso, o backend está funcionando!**

---

## 📋 Passo 2: Configurar Frontend na Vercel

### 2.1. Adicionar Variável de Ambiente

1. Acesse: **https://vercel.com/brunos-projects-9672b208/groom-guru-platform**
2. Clique em **"Settings"** (menu superior)
3. Clique em **"Environment Variables"** (menu lateral)
4. Clique em **"+ Add New"**
5. Preencha:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://groom-guru-platform-production.up.railway.app/api`
     - ⚠️ **IMPORTANTE:** Adicione `/api` no final
   - Marque todas as opções:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. Clique em **"Save"**

### 2.2. Fazer Redeploy do Frontend

1. Na Vercel, vá em **"Deployments"**
2. Clique nos **3 pontinhos** (⋯) do último deploy
3. Clique em **"Redeploy"**
4. Aguarde o deploy terminar (2-3 minutos)

---

## 📋 Passo 3: Testar Tudo

### 3.1. Testar Cadastro de Barbearia

1. Acesse: **https://groom-guru-platform.vercel.app**
2. Vá em **"Cadastro"** ou acesse: **https://groom-guru-platform.vercel.app/cadastro?tipo=dono**
3. Preencha o formulário:
   - Nome da Barbearia: "Teste"
   - Nome do contato: "Seu Nome"
   - Telefone: "19999999999"
   - Email: "teste@email.com"
   - Senha: "123456"
4. Clique em **"CADASTRAR"**
5. Deve funcionar! ✅

### 3.2. Testar Login

1. Acesse: **https://groom-guru-platform.vercel.app/login**
2. Selecione a aba **"Dono"**
3. Use o email e senha que você cadastrou
4. Clique em **"ENTRAR"**
5. Deve fazer login e redirecionar! ✅

---

## ✅ Checklist Final

- [ ] Backend testado: `/api/health` retorna `{"status": "API is running"}`
- [ ] Variável `VITE_API_URL` configurada na Vercel
- [ ] Valor da variável: `https://groom-guru-platform-production.up.railway.app/api`
- [ ] Frontend redeployado na Vercel
- [ ] Teste de cadastro funcionando
- [ ] Teste de login funcionando

---

## 🆘 Se Algo Der Erro

### Erro: "Failed to fetch"
- Verifique se a URL está correta na Vercel
- Verifique se adicionou `/api` no final da URL
- Verifique se fez redeploy do frontend

### Erro: "Cannot connect to server"
- Verifique se o backend está "Active" no Railway
- Teste `/api/health` diretamente no navegador
- Verifique os logs no Railway

### Erro: "CORS error"
- Verifique se `FRONTEND_URL` está configurada no Railway
- Valor deve ser: `https://groom-guru-platform.vercel.app`

---

## 🎯 Resumo das URLs

### Backend (Railway):
```
https://groom-guru-platform-production.up.railway.app
```

### Frontend (Vercel):
```
https://groom-guru-platform.vercel.app
```

### API Health Check:
```
https://groom-guru-platform-production.up.railway.app/api/health
```

---

**Siga esses passos e seu sistema estará 100% funcional!** 🚀

