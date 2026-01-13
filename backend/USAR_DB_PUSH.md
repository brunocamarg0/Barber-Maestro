# ✅ Solução: Usar `prisma db push` ao invés de `migrate`

## 🔍 Problema

O erro "Timed out trying to acquire a postgres advisory lock" acontece porque:
- `prisma migrate` precisa de locks especiais do PostgreSQL
- O Supabase pode ter limitações com esses locks
- Ou há algum processo travado

## ✅ Solução: Usar `prisma db push`

O `prisma db push` aplica o schema **diretamente** sem precisar de locks de migração.

### Como Usar:

1. **No terminal, digite:**

```bash
cd backend
npx prisma db push
```

2. **Quando pedir confirmação**, digite: `y` (yes)

3. **Pronto!** As tabelas serão criadas diretamente.

---

## ⚠️ Diferença Entre `migrate` e `db push`

- **`prisma migrate`**: Cria arquivos de migração (histórico) - precisa de locks
- **`prisma db push`**: Aplica schema diretamente - mais simples, sem locks

Para começar, **`db push` é mais fácil**!

---

## ✅ Resultado Esperado

Você verá:

```
✔ Schema pushed to database
✔ Generated Prisma Client
```

---

## 🔄 Depois de Funcionar

Se quiser usar migrações no futuro (para histórico), pode migrar depois. Por enquanto, `db push` resolve!

---

**Tente rodar: `npx prisma db push` no terminal!** 🚀

