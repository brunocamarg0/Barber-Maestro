# 🚀 Como Executar Comandos do Prisma

## ❌ Problema: Windows pedindo aplicação para abrir npx

Isso acontece quando o Windows não reconhece o `npx` como comando.

## ✅ Soluções

### Opção 1: Usar `npm run` (Recomendado)

Ao invés de `npx prisma db push`, use:

```bash
cd backend
npm run prisma:push
```

Este comando já está configurado no `package.json`!

---

### Opção 2: Usar caminho completo do node

```bash
cd backend
node node_modules/.bin/prisma db push
```

---

### Opção 3: Verificar Node.js

Verifique se o Node.js está instalado:

```bash
node --version
npm --version
```

Se não aparecer versão, instale o Node.js:
- https://nodejs.org/
- Baixe a versão LTS
- Instale
- Reinicie o terminal

---

## ✅ Comando Recomendado

**Use este comando no terminal:**

```bash
cd backend
npm run prisma:push
```

Quando pedir confirmação, digite: `y`

---

## 📋 Passo a Passo Completo

1. **Abra PowerShell ou Terminal**
   - Pressione `Win + X` → PowerShell
   - Ou terminal do VS Code: `Ctrl + '`

2. **Navegue para a pasta:**
   ```bash
   cd "C:\Users\bruno\OneDrive\Documents\groom-guru-platform-main\backend"
   ```

3. **Rode o comando:**
   ```bash
   npm run prisma:push
   ```

4. **Quando pedir confirmação:**
   - Digite: `y`
   - Pressione Enter

---

## ✅ Resultado Esperado

Você verá:

```
✔ Schema pushed to database
✔ Generated Prisma Client
```

---

**Tente: `npm run prisma:push` no terminal!** 🚀

