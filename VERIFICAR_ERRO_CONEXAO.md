# 🔍 Verificar Erro de Conexão - Passo a Passo

## 🔴 Erro Atual

```
Não foi possível conectar ao servidor. URL: 
https://groom-guru-platform-production.up.railway.app/api/auth/dono/cadastro-direto
Verifique se o backend está online e se CORS está configurado.
```

---

## ✅ Passo 1: Verificar se Backend Está Online

### 1.1. Teste Direto no Navegador

Abra no navegador:
```
https://groom-guru-platform-production.up.railway.app/api/health
```

**O que deve aparecer:**
```json
{
  "status": "API is running",
  "timestamp": "2024-..."
}
```

### 1.2. Se NÃO Aparecer Isso:

- ❌ Backend está **OFFLINE** no Railway
- ✅ Vá no Railway → Verifique se está "Active"
- ✅ Veja os logs no Railway para ver erros

---

## ✅ Passo 2: Verificar Variáveis no Railway

### 2.1. No Railway, vá em Variables

Verifique se tem estas variáveis:

1. **DATABASE_URL** ✅
2. **JWT_SECRET** ✅
3. **SESSION_SECRET** ✅
4. **NODE_ENV** = `production` ✅
5. **PORT** = `3001` ✅
6. **FRONTEND_URL** = `https://groom-guru-platform.vercel.app` ⚠️ **IMPORTANTE!**

### 2.2. Se `FRONTEND_URL` NÃO Existir:

1. Clique em **"+ New Variable"**
2. **Name:** `FRONTEND_URL`
3. **Value:** `https://groom-guru-platform.vercel.app`
4. **Salve**
5. Railway vai fazer deploy automaticamente

---

## ✅ Passo 3: Verificar Deploy do Railway

### 3.1. No Railway, vá em Deployments

1. Veja o último deploy
2. Status deve ser: **"SUCCESS"** (verde)
3. Se estiver **"FAILED"** (vermelho):
   - Clique no deploy
   - Veja os logs
   - Procure por erros

### 3.2. Se Deploy Falhou:

- Verifique se todas as variáveis estão configuradas
- Veja os logs para identificar o erro
- Pode ser erro de conexão com banco de dados

---

## ✅ Passo 4: Verificar Logs do Railway

### 4.1. No Railway, vá em Deployments

1. Clique no último deploy
2. Veja os **"Logs"**
3. Procure por:
   - `Server is running on port 3001` ✅
   - `Error` ❌
   - `Failed to connect` ❌

### 4.2. Se Ver Erros:

- **"Database connection failed"** → Verifique `DATABASE_URL`
- **"Port already in use"** → Normal, Railway gerencia
- **"Cannot find module"** → Dependências não instaladas

---

## ✅ Passo 5: Testar CORS no Console

### 5.1. Abra o Console (F12)

1. Acesse: https://groom-guru-platform.vercel.app
2. Pressione **F12**
3. Vá na aba **Console**
4. Cole e execute:

```javascript
// Teste 1: Health check
fetch('https://groom-guru-platform-production.up.railway.app/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend OK:', data))
  .catch(error => console.error('❌ Erro:', error));

// Teste 2: CORS
fetch('https://groom-guru-platform-production.up.railway.app/api/auth/dono/cadastro-direto', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nomeBarbearia: 'Teste',
    nomeContato: 'Teste',
    telefone: '19999999999',
    email: 'teste@teste.com',
    senha: '123456'
  })
})
  .then(r => r.json())
  .then(data => console.log('✅ CORS OK:', data))
  .catch(error => console.error('❌ CORS Erro:', error));
```

**O que você vê?**
- Se aparecer `✅ Backend OK` → Backend está online
- Se aparecer `✅ CORS OK` → CORS está funcionando
- Se aparecer `❌ CORS Erro` → CORS ainda não está configurado

---

## 🎯 Checklist Final

- [ ] Backend responde em `/api/health`
- [ ] Variável `FRONTEND_URL` configurada no Railway
- [ ] Deploy do Railway está "SUCCESS"
- [ ] Logs mostram "Server is running"
- [ ] Teste no console funcionou

---

## 🆘 Se Ainda Não Funcionar

### Opção 1: Forçar Novo Deploy

1. No Railway, vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯)
3. Clique em **"Redeploy"**
4. Aguarde terminar

### Opção 2: Verificar Código

O código já foi atualizado, mas verifique se o deploy pegou as mudanças.

---

**Faça esses testes e me diga o resultado de cada um!** 🔍

