# 🧪 Guia de Teste - Sistema de Convites

## 📋 Pré-requisitos
- Node.js instalado
- npm ou yarn

## 🚀 Passo a Passo para Testar

### 1️⃣ Instalar Dependências do Backend
```bash
cd backend
npm install
```

### 2️⃣ Configurar Banco de Dados

**Opção A: SQLite (Mais fácil para teste rápido)**
- Não precisa instalar nada
- Crie arquivo `backend/.env`:
```
DATABASE_URL="file:./dev.db"
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Opção B: PostgreSQL (Produção)**
- Instale PostgreSQL
- Crie banco de dados
- Configure `DATABASE_URL` no `.env`

### 3️⃣ Atualizar Schema para SQLite (se usar SQLite)
Edite `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"  // Mude de "postgresql" para "sqlite"
  url      = env("DATABASE_URL")
}
```

### 4️⃣ Rodar Migrações
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### 5️⃣ Iniciar Backend
```bash
cd backend
npm run dev
```
Backend rodará em: http://localhost:3001

### 6️⃣ Iniciar Frontend (em outro terminal)
```bash
npm run dev
```
Frontend rodará em: http://localhost:5173

## 🧪 Como Testar o Fluxo

1. **Acesse o Admin**: http://localhost:5173/admin
2. **Crie uma Barbearia**: Clique em "Nova Barbearia"
3. **Veja Detalhes**: Clique na barbearia criada
4. **Gere Convite**: Clique em "Gerar Convite" no card "Convite para Dono"
5. **Copie o Link**: Copie o link de ativação gerado
6. **Ative Conta**: Acesse o link em nova aba/incógnito
7. **Preencha Formulário**: Nome, email, senha
8. **Conta Ativada**: Redireciona para login

## ✅ Verificar se está funcionando

- Backend: http://localhost:3001/api/health
- Frontend: http://localhost:5173





