# 🚀 Como Rodar o Backend

## ⚠️ Erro "Failed to fetch"

Se você está vendo o erro **"Failed to fetch"** ao criar cliente, o backend provavelmente **não está rodando**!

## ✅ Solução: Rodar o Backend

### 1. Abra um Terminal/PowerShell

### 2. Navegue para a pasta `backend`:

```bash
cd backend
```

### 3. Instale as dependências (se ainda não instalou):

```bash
npm install
```

### 4. Rode o backend:

```bash
npm run dev
```

### 5. Você deve ver:

```
🚀 Server is running on http://localhost:3001
📚 API Health: http://localhost:3001/api/health
```

## ✅ Verificar se o Backend Está Funcionando

Abra no navegador:
- http://localhost:3001/api/health

Deve retornar:
```json
{
  "status": "API is running",
  "timestamp": "2024-..."
}
```

## ✅ Testar Criação de Cliente

1. **Backend rodando** (npm run dev no terminal)
2. **Frontend rodando** (npm run dev na pasta raiz)
3. Acesse o painel do dono: http://localhost:5173/dono/clientes
4. Clique em "Novo Cliente"
5. Preencha os dados
6. Clique em "Cadastrar"

---

## ⚠️ Se Ainda Der Erro

### 1. Verifique se a URL da API está correta

O frontend usa: `http://localhost:3001`

Se você mudou a porta do backend, atualize no arquivo:
- `src/services/donoApi.ts` (linha 2)
- Ou crie arquivo `.env` na raiz com: `VITE_API_URL=http://localhost:3001`

### 2. Verifique CORS

O backend está configurado para aceitar requisições de:
- `http://localhost:5173` (Vite padrão)

Se você usa outra porta, atualize em:
- `backend/src/app.ts` (linha 21)

---

## 📋 Checklist

- [ ] Backend rodando (`npm run dev` na pasta backend)
- [ ] Frontend rodando (`npm run dev` na pasta raiz)
- [ ] Backend acessível em http://localhost:3001/api/health
- [ ] Sem erros no terminal do backend

---

**Depois de rodar o backend, tente criar cliente novamente!** 🚀

