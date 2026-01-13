# ⚠️ Erro "Failed to fetch" ao Cadastrar Barbearia

## 🔍 Problema Identificado

O erro "Failed to fetch" acontece porque **o backend não está rodando**!

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

## ✅ Depois que o backend estiver rodando:

1. Volte ao frontend
2. Tente cadastrar barbearia novamente
3. Deve funcionar! ✅

---

## 📋 Checklist

- [ ] Backend rodando (`npm run dev` na pasta backend)
- [ ] Frontend rodando (`npm run dev` na pasta raiz)
- [ ] Backend acessível em http://localhost:3001/api/health
- [ ] Sem erros no terminal do backend

---

## ⚠️ Se Ainda Der Erro

Verifique:
1. **URL da API está correta?**
   - Frontend usa: `http://localhost:3001/api`
   - Verifique no arquivo: `src/pages/Cadastro.tsx` (linha 12)

2. **CORS está configurado?**
   - Backend deve aceitar requisições de: `http://localhost:5173`
   - Verifique em: `backend/src/app.ts`

3. **Porta 3001 está livre?**
   - Se outra aplicação estiver usando a porta 3001, mude no `.env` do backend

---

**RODE O BACKEND AGORA!** 🚀

