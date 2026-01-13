# 🧪 Teste Rápido do Backend

## ✅ Passo 1: Testar Backend Diretamente

Abra no navegador e teste:

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

### Se NÃO aparecer isso:
- ❌ Backend está offline no Railway
- ❌ Verifique se está "Active" no Railway
- ❌ Veja os logs no Railway

---

## ✅ Passo 2: Testar no Console do Navegador

1. Abra o site: **https://groom-guru-platform.vercel.app**
2. Pressione **F12** (abrir DevTools)
3. Vá na aba **Console**
4. Cole e execute:

```javascript
// Ver qual URL está sendo usada
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

// Testar conexão direta
fetch('https://groom-guru-platform-production.up.railway.app/api/health')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Backend respondeu:', data);
  })
  .catch(error => {
    console.error('❌ Erro ao conectar:', error);
  });
```

**O que você vê?**
- Se aparecer `✅ Backend respondeu` → Backend está OK
- Se aparecer `❌ Erro ao conectar` → Problema de CORS ou backend offline

---

## ✅ Passo 3: Verificar Variável na Vercel

1. Acesse: **https://vercel.com/brunos-projects-9672b208/groom-guru-platform**
2. **Settings** → **Environment Variables**
3. Procure por `VITE_API_URL`
4. **Valor deve ser:** `https://groom-guru-platform-production.up.railway.app/api`

**Se não existir ou estiver errado:**
- Clique em **"+ Add New"**
- Name: `VITE_API_URL`
- Value: `https://groom-guru-platform-production.up.railway.app/api`
- Marque: ✅ Production, ✅ Preview, ✅ Development
- **Salve**
- **Faça redeploy** (sem cache!)

---

## ✅ Passo 4: Verificar CORS no Railway

No Railway, verifique se tem a variável:

**Name:** `FRONTEND_URL`  
**Value:** `https://groom-guru-platform.vercel.app`

**Se não tiver:**
1. No Railway, vá em **Variables**
2. Clique em **"+ New Variable"**
3. Name: `FRONTEND_URL`
4. Value: `https://groom-guru-platform.vercel.app`
5. Salve
6. Railway vai reiniciar automaticamente

---

## 🎯 Resumo

1. ✅ Teste `/api/health` no navegador
2. ✅ Teste no console do navegador (F12)
3. ✅ Verifique variável na Vercel
4. ✅ Verifique `FRONTEND_URL` no Railway
5. ✅ Me diga o resultado de cada teste

---

**Faça esses testes e me diga o que encontrou!** 🔍

