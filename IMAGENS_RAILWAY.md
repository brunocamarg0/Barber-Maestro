# 📸 O Que Você Vai Ver no Railway

## Passo 3: Configurar Deploy

### Tela: "Configure your project"

Você verá algo assim:

```
┌─────────────────────────────────────┐
│  Configure your project            │
├─────────────────────────────────────┤
│                                     │
│  Root Directory: [backend    ]     │
│                                     │
│  [Cancel]  [Deploy]                 │
└─────────────────────────────────────┘
```

**Ação:** 
- Digite `backend` no campo "Root Directory"
- Ou deixe vazio (Railway pode detectar)
- Clique em **"Deploy"**

---

## Passo 4: Variáveis de Ambiente

### Tela: "Variables"

Você verá:

```
┌─────────────────────────────────────┐
│  Variables                          │
├─────────────────────────────────────┤
│  + New Variable                     │
│                                     │
│  (Lista vazia inicialmente)         │
└─────────────────────────────────────┘
```

**Ação:**
1. Clique em **"+ New Variable"**
2. Preencha Name e Value
3. Clique em **"Add"**
4. Repita para cada variável

---

## Passo 5: Obter URL

### Tela: Settings → Networking

Você verá:

```
┌─────────────────────────────────────┐
│  Networking                         │
├─────────────────────────────────────┤
│                                     │
│  Public Domain:                     │
│  [Generate Domain]                  │
│                                     │
│  (Depois de gerar:)                 │
│  https://groom-guru-backend-xxx.    │
│  railway.app                        │
│  [Copy]                             │
└─────────────────────────────────────┘
```

**Ação:**
1. Clique em **"Generate Domain"**
2. Copie a URL gerada

---

## Passo 6: Verificar Deploy

### Tela: Deployments

Você verá:

```
┌─────────────────────────────────────┐
│  Deployments                        │
├─────────────────────────────────────┤
│  🟢 SUCCESS  (há 2 minutos)         │
│  🟡 BUILDING (agora)                │
│  🔴 FAILED   (há 5 minutos)         │
└─────────────────────────────────────┘
```

**Ação:**
- Aguarde até ver **🟢 SUCCESS**
- Clique no deploy para ver logs

---

## 🎯 Dicas Visuais

### ✅ Tudo Certo:
- Status: **SUCCESS** (verde)
- Logs mostram: "Server is running"
- `/api/health` retorna JSON

### ⚠️ Problema:
- Status: **FAILED** (vermelho)
- Clique para ver logs
- Verifique variáveis de ambiente

---

**Siga essas indicações visuais!** 🚀

