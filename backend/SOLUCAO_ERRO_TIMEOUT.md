# 🔧 Solução: Erro de Timeout no Banco Supabase

## ❌ Erro Encontrado

```
Error: P1002
The database server at `db.zozmkzcuulgwjbbpgple.supabase.co:5432` was reached but timed out.
Timed out trying to acquire a postgres advisory lock
```

## 🔍 Causa

O banco de dados do **Supabase Free** está **pausado** (pausa automaticamente após inatividade).

## ✅ Solução: Reativar Banco no Supabase

### Passo 1: Acessar Dashboard do Supabase

1. Acesse: **https://supabase.com/dashboard**
2. Faça login na sua conta
3. Procure pelo projeto: **zozmkzcuulgwjbbpgple**

### Passo 2: Verificar Status do Banco

1. No dashboard do projeto, procure por **"Database"** ou **"Banco de Dados"**
2. Você verá o status:
   - 🔴 **Paused** (Pausado) - Precisa reativar
   - 🟢 **Active** (Ativo) - Já está funcionando

### Passo 3: Reativar Banco

**Se estiver pausado:**

1. Clique no botão **"Resume"** ou **"Reativar"**
2. Aguarde 1-2 minutos para o banco inicializar
3. Você verá uma mensagem: **"Database is active"**

### Passo 4: Tentar Migração Novamente

Após o banco estar ativo, rode:

```bash
cd backend
npm run prisma:migrate
```

Quando pedir o nome da migração, digite: `init_dono_panel`

---

## 🔄 Alternativa: Criar Migração Local Primeiro

Se quiser criar a migração localmente primeiro (sem aplicar ainda):

```bash
cd backend
npx prisma migrate dev --create-only --name init_dono_panel
```

Isso cria o arquivo de migração sem tentar aplicar no banco.

Depois, quando o banco estiver ativo, rode:

```bash
npm run prisma:migrate
```

---

## ⚠️ Notas Importantes

1. **Banco Free pausa automaticamente** após 7 dias de inatividade
2. **Reativação leva 1-2 minutos**
3. **Primeira migração pode demorar** (cria muitas tabelas)
4. **Não use pgbouncer** para migrações (só para queries)

---

## ✅ Após Migração Bem-Sucedida

Você verá mensagens como:

```
✔ Applied migration `init_dono_panel` in 2.5s
✔ Generated Prisma Client
```

Aí você poderá continuar com a criação das APIs!

