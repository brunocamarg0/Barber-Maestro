# 🚀 Como Rodar Migrações do Prisma

## ⚠️ Importante

**Cancele os diálogos** que estão pedindo para escolher aplicação! Não escolha nada.

## ✅ Forma Correta: Terminal/PowerShell

### Opção 1: Usar o Terminal já Aberto

1. **No terminal que já está aberto**, digite:

```bash
cd backend
npm run prisma:migrate
```

2. Quando pedir o nome da migração, digite: `init_dono_panel`

3. Pressione **Enter**

---

## 🧪 Teste Rápido Antes

Se quiser testar a conexão primeiro:

```bash
cd backend
node TESTE_SIMPLES_CONEXAO.js
```

Se aparecer `✅ Conexão OK!`, a conexão está funcionando!

---

## 📋 Comandos Passo a Passo

### 1. Abrir Terminal/PowerShell

- **Windows:** Pressione `Win + X` → Escolha "Windows PowerShell" ou "Terminal"
- Ou use o terminal do VS Code: `Ctrl + '` (crase)

### 2. Navegar para a Pasta

```bash
cd "C:\Users\bruno\OneDrive\Documents\groom-guru-platform-main\backend"
```

### 3. Rodar Migrações

```bash
npm run prisma:migrate
```

Quando pedir o nome, digite: `init_dono_panel`

---

## ✅ Resultado Esperado

Você deve ver mensagens como:

```
✔ Applied migration `init_dono_panel` in 2.5s
✔ Generated Prisma Client
```

---

## ❌ Se Der Erro

1. Verifique se está na pasta correta: `backend`
2. Verifique se o banco está ativo no Supabase
3. Tente novamente

---

**Importante:** Use o terminal/PowerShell, não os diálogos do Windows! 🚀

