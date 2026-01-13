# 📋 Resumo: Como Rodar Migrações

## ⚠️ CANCELE OS DIÁLOGOS DO WINDOWS!

Não escolha nenhuma aplicação. Cancele tudo!

## ✅ Use o Terminal/PowerShell

### Passo a Passo:

1. **Abra PowerShell ou Terminal:**
   - `Win + X` → PowerShell
   - Ou use terminal do VS Code: `Ctrl + '`

2. **Navegue para a pasta:**
   ```bash
   cd "C:\Users\bruno\OneDrive\Documents\groom-guru-platform-main\backend"
   ```

3. **Rode as migrações:**
   ```bash
   npm run prisma:migrate
   ```

4. **Quando pedir o nome da migração:**
   ```
   init_dono_panel
   ```

5. **Pressione Enter**

---

## ✅ Se Funcionar

Você verá:
```
✔ Applied migration `init_dono_panel`
✔ Generated Prisma Client
```

---

## 🧪 Teste Rápido (Opcional)

Antes de rodar migrações, teste a conexão:

```bash
cd backend
node TESTE_SIMPLES_CONEXAO.js
```

Se aparecer `✅ Conexão OK!`, está tudo certo!

---

**Use o terminal diretamente, não os diálogos do Windows!** 🚀

