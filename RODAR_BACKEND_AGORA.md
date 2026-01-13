# ⚠️ ERRO: "Failed to fetch" ao salvar cliente

## 🔍 Problema Identificado

O backend **NÃO está rodando**! Por isso aparece o erro "Failed to fetch".

## ✅ Solução Imediata

### 1. Abra um Terminal/PowerShell NOVO

### 2. Navegue para a pasta backend:

```bash
cd "C:\Users\bruno\OneDrive\Documents\groom-guru-platform-main\backend"
```

### 3. Rode o backend:

```bash
npm run dev
```

### 4. Você deve ver:

```
🚀 Server is running on http://localhost:3001
📚 API Health: http://localhost:3001/api/health
```

### 5. Teste se está funcionando:

Abra no navegador: http://localhost:3001/api/health

Deve retornar: `{"status": "API is running", ...}`

---

## ⚠️ Possível Problema: Autenticação

As rotas do painel do dono agora exigem autenticação JWT!

Se aparecer erro 401 (Unauthorized), você precisa:
1. Fazer login no painel do dono
2. Ou temporariamente desabilitar a autenticação para testes

---

## ✅ Depois que o backend estiver rodando:

1. Volte ao frontend
2. Tente criar cliente novamente
3. Se der erro de autenticação, me avise!

---

**RODE O BACKEND AGORA!** 🚀

