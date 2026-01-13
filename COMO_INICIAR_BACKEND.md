# 🚀 Como Iniciar o Backend

## ⚠️ Erro: "Não foi possível conectar ao servidor"

Este erro aparece quando o **backend não está rodando**.

## ✅ Solução: Iniciar o Backend

### Passo 1: Abra um Terminal/PowerShell

### Passo 2: Navegue para a pasta backend

```bash
cd "C:\Users\bruno\OneDrive\Documents\groom-guru-platform-main\backend"
```

### Passo 3: Inicie o backend

```bash
npm run dev
```

### Passo 4: Aguarde a mensagem

Você deve ver:

```
🚀 Server is running on http://localhost:3001
📚 API Health: http://localhost:3001/api/health
```

### Passo 5: Teste se está funcionando

Abra no navegador: **http://localhost:3001/api/health**

Deve retornar:
```json
{
  "status": "API is running",
  "timestamp": "2024-..."
}
```

---

## ✅ Depois que o backend estiver rodando:

1. **Mantenha o terminal aberto** (não feche!)
2. Volte ao frontend
3. Tente cadastrar barbearia novamente
4. Deve funcionar! ✅

---

## ⚠️ Se der erro ao iniciar

### Erro: "Cannot find module"
```bash
cd backend
npm install
npm run dev
```

### Erro: "Port 3001 already in use"
- Outra aplicação está usando a porta 3001
- Feche a outra aplicação ou mude a porta no `.env`

### Erro: "Database connection failed"
- Verifique se o banco Supabase está ativo
- Verifique as credenciais no arquivo `backend/.env`

---

## 📋 Checklist

- [ ] Backend rodando (`npm run dev` na pasta backend)
- [ ] Terminal do backend está aberto e mostrando "Server is running"
- [ ] Backend acessível em http://localhost:3001/api/health
- [ ] Frontend rodando em outro terminal
- [ ] Sem erros no terminal do backend

---

**IMPORTANTE: O backend precisa estar rodando enquanto você usa o sistema!** 🚀

