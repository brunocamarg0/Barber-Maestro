# 🔍 Teste de Conexão com Supabase

## ⚠️ Importante: Banco Pausado

O Supabase **pausa** bancos de dados do plano **Free** após 1 semana de inatividade.

## 🔄 Como Reativar o Banco

1. Acesse: https://supabase.com/dashboard
2. Entre no seu projeto
3. O banco será **reativado automaticamente** (pode levar 1-2 minutos)

## 🧪 Testar Conexão

Após reativar o banco, tente rodar as migrações novamente:

```bash
cd backend
npm run prisma:migrate
```

Quando pedir o nome da migração, digite: `init_dono_panel`

## ✅ Se Funcionar

Você verá mensagens como:
```
✔ Migrated database in 2.5s
✔ Generated Prisma Client
```

## ❌ Se Ainda Der Erro

1. Verifique se o banco está ativo no dashboard do Supabase
2. Aguarde 2-3 minutos após reativar
3. Tente novamente

---

## 📋 Status

- ✅ Dependências instaladas
- ✅ Prisma Client gerado
- ⏳ Aguardando banco ativo para migrações
- ⏳ Migrações pendentes

