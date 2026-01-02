# 🧪 Como Testar o Sistema de Convites

## ⚡ Configuração Rápida (SQLite)

### Passo 1: Instalar Dependências do Backend
Abra um terminal na pasta do projeto e execute:
```bash
cd backend
npm install
```

### Passo 2: Configurar Banco de Dados
O arquivo `.env` já foi criado com SQLite. Se não existir, crie `backend/.env`:
```
DATABASE_URL="file:./dev.db"
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Passo 3: Rodar Migrações
```bash
cd backend
npm run prisma:migrate
# Quando perguntar o nome da migration, digite: init
npm run prisma:generate
```

### Passo 4: Iniciar Backend
Em um terminal:
```bash
cd backend
npm run dev
```
✅ Backend rodando em: http://localhost:3001

### Passo 5: Iniciar Frontend
Em OUTRO terminal (deixe o backend rodando):
```bash
npm run dev
```
✅ Frontend rodando em: http://localhost:5173

---

## 🧪 Testar o Fluxo Completo

### 1. Acesse o Admin
- Abra: http://localhost:5173/admin
- Você verá a lista de barbearias (pode estar vazia)

### 2. Criar Barbearia
- Clique em "Nova Barbearia"
- Preencha os dados:
  - Nome: "Barbearia Teste"
  - CNPJ/CPF: "12.345.678/0001-90"
  - Responsável: "João Silva"
  - Plano: Selecione um (Básico, Premium ou Enterprise)
  - Email, Telefone (opcionais)
- Clique em "Salvar"

### 3. Ver Detalhes da Barbearia
- Na lista, clique na barbearia criada
- Você verá os detalhes completos

### 4. Gerar Convite
- Na página de detalhes, role até o card "Convite para Dono"
- Clique em "Gerar Convite"
- (Opcional) Digite um email
- Clique em "Gerar Convite"
- **Copie o link de ativação** que aparece

### 5. Ativar Conta do Dono
- Abra o link copiado em uma nova aba (ou modo anônimo)
- Você verá a tela de ativação
- Preencha:
  - Nome: "João Silva"
  - Email: "joao@barbearia.com"
  - Senha: (mínimo 6 caracteres)
  - Confirmar Senha
- Clique em "Ativar Conta"
- ✅ Sucesso! Conta criada

### 6. Verificar no Banco
- O dono foi criado e vinculado à barbearia
- O convite foi marcado como usado

---

## 🔍 Verificar se está funcionando

### Backend
- Acesse: http://localhost:3001/api/health
- Deve retornar: `{"status":"API is running"}`

### Frontend
- Acesse: http://localhost:5173
- Deve carregar a página inicial

---

## ❌ Problemas Comuns

### "npm não é reconhecido"
- Instale Node.js: https://nodejs.org/
- Reinicie o terminal

### "Erro ao conectar banco"
- Verifique se o arquivo `.env` existe em `backend/`
- Verifique se rodou as migrações

### "Porta já em uso"
- Feche outros processos usando a porta 3001 ou 5173
- Ou mude a porta no `.env`

---

## 📝 Próximos Passos

Depois de testar, você pode:
1. Conectar o frontend ao backend real (substituir mocks)
2. Adicionar autenticação JWT
3. Implementar outras funcionalidades

