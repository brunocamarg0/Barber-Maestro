# 🔍 Como Obter a URL do Backend no Railway

## 📋 Método 1: Settings → Networking (Mais Comum)

1. No Railway, clique no seu **projeto**
2. Clique no **serviço** (geralmente aparece como "groom-guru-platform" ou "backend")
3. Vá em **"Settings"** (menu lateral ou superior)
4. Role até encontrar **"Networking"** ou **"Public Networking"**
5. Procure por:
   - **"Public Domain"**
   - **"Generate Domain"**
   - **"Custom Domain"**
   - **"Expose Port"**

### Se não aparecer "Generate Domain":

1. Procure por **"Expose Port"** ou **"Make Public"**
2. Clique para ativar
3. Railway vai gerar uma URL automaticamente

---

## 📋 Método 2: Service Settings

1. No Railway, clique no seu **projeto**
2. Clique no **serviço** (card do backend)
3. Vá em **"Settings"** (ícone de engrenagem)
4. Procure por:
   - **"Networking"**
   - **"Ports"**
   - **"Public URL"**

---

## 📋 Método 3: Deployments → Logs

1. No Railway, vá em **"Deployments"**
2. Clique no último deploy (que está "Active")
3. Veja os **"Logs"**
4. Procure por mensagens como:
   - `Server is running on http://0.0.0.0:3001`
   - `Listening on port 3001`
   - URL pode aparecer nos logs

---

## 📋 Método 4: Service Overview

1. No Railway, clique no seu **projeto**
2. Na página principal do projeto, você verá cards dos serviços
3. Clique no card do **backend**
4. Na página do serviço, procure por:
   - URL no topo da página
   - **"Public URL"** ou **"Domain"**
   - Link clicável

---

## 📋 Método 5: Criar Domínio Manualmente

Se nenhum método acima funcionar:

1. No Railway, vá em **Settings** do serviço
2. Procure por **"Networking"** ou **"Ports"**
3. Clique em **"Expose Port"** ou **"Make Public"**
4. Selecione a porta: **3001** (ou a porta que você configurou)
5. Railway vai gerar uma URL automaticamente

---

## 📋 Método 6: Verificar Variáveis de Ambiente

Às vezes a URL está nas variáveis:

1. Vá em **"Variables"** (no serviço)
2. Procure por variáveis como:
   - `RAILWAY_PUBLIC_DOMAIN`
   - `RAILWAY_URL`
   - `PUBLIC_URL`

---

## 🔍 O Que Procurar na Interface

Procure por estas palavras-chave na interface do Railway:

- ✅ **"Public Domain"**
- ✅ **"Generate Domain"**
- ✅ **"Expose Port"**
- ✅ **"Make Public"**
- ✅ **"Networking"**
- ✅ **"Public URL"**
- ✅ **"Custom Domain"**
- ✅ **"Ports"**

---

## 📸 Onde Geralmente Está

A URL geralmente aparece em um destes lugares:

1. **Topo da página do serviço** (logo abaixo do nome)
2. **Settings → Networking** (menu lateral)
3. **Settings → Ports** (menu lateral)
4. **Service Overview** (página principal do serviço)

---

## 🆘 Se Ainda Não Encontrar

### Opção A: Criar Novo Serviço com Domínio

1. No Railway, vá em **"New"** → **"Service"**
2. Selecione **"GitHub Repo"**
3. Selecione o mesmo repositório
4. Configure **Root Directory:** `backend`
5. Railway pode gerar URL automaticamente

### Opção B: Usar Railway CLI

Se você tiver Railway CLI instalado:

```bash
railway status
```

Isso mostra a URL do serviço.

---

## ✅ Depois de Encontrar a URL

1. **Copie a URL** (exemplo: `https://groom-guru-backend-xxx.railway.app`)
2. **Teste no navegador:** `https://sua-url.railway.app/api/health`
3. Deve retornar: `{"status": "API is running", ...}`

---

## 🎯 Dica Importante

Se o serviço está "Active" mas não tem URL pública:

1. Railway pode estar usando **porta interna** apenas
2. Você precisa **ativar "Expose Port"** ou **"Make Public"**
3. Isso gera automaticamente uma URL pública

---

**Tente esses métodos e me diga o que você encontrou!** 🔍

