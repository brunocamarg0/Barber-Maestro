# 🔌 Configurar Porta no Railway - Generate Domain

## ✅ Solução Rápida

Quando o Railway pedir a porta, digite:

```
3001
```

---

## 📋 Passo a Passo

### 1. No Railway, ao clicar em "Generate Domain"

1. Railway vai mostrar um campo: **"Port"** ou **"Porta"**
2. Digite: `3001`
3. Clique em **"Generate"** ou **"Criar"**

### 2. Railway Vai Gerar a URL

Após digitar a porta, Railway vai criar uma URL como:

```
https://groom-guru-backend-production.up.railway.app
```

ou

```
https://groom-guru-platform-production.up.railway.app
```

### 3. Copiar a URL

1. **COPIE ESSA URL!**
2. Anote em algum lugar seguro
3. Você vai precisar dela para configurar o frontend

---

## ✅ Por Que Porta 3001?

O backend está configurado para usar a porta 3001:

- ✅ Variável de ambiente `PORT=3001` no Railway
- ✅ Código do backend usa `process.env.PORT || 3001`
- ✅ É a porta padrão do nosso backend

---

## 🧪 Testar Após Gerar URL

1. Copie a URL gerada (exemplo: `https://groom-guru-backend-xxx.railway.app`)
2. Abra no navegador: `https://sua-url.railway.app/api/health`
   - Substitua `sua-url.railway.app` pela URL que você copiou
3. Deve retornar:
   ```json
   {
     "status": "API is running",
     "timestamp": "2024-..."
   }
   ```

✅ **Se retornar isso, está funcionando!**

---

## 🆘 Se Der Erro

### Erro: "Port already in use"
- Railway pode estar usando outra porta
- Verifique os logs do deploy para ver qual porta está sendo usada

### Erro: "Invalid port"
- Certifique-se de digitar apenas números: `3001`
- Não adicione `:` ou outros caracteres

### Erro: "Connection refused"
- Aguarde alguns minutos após gerar o domínio
- Railway precisa configurar o roteamento

---

## 📋 Próximo Passo

Depois de gerar a URL:

1. ✅ Teste no navegador: `https://sua-url.railway.app/api/health`
2. ✅ Configure no frontend (Vercel):
   - Variável: `VITE_API_URL`
   - Valor: `https://sua-url.railway.app/api`
3. ✅ Faça redeploy do frontend

---

**Digite 3001 e gere o domínio!** 🚀

