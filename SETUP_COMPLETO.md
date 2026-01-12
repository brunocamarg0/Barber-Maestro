# ✅ Setup Completo - Sistema de Convites com Email

## 🎯 O que foi implementado

✅ **Criação automática de convite** ao criar barbearia  
✅ **Envio automático de email** com link de ativação  
✅ **Template de email** profissional  
✅ **Banco de dados SQLite** configurado  
✅ **Serviço de email** (Ethereal para dev, SMTP para produção)

---

## 🚀 Como Configurar e Rodar

### Passo 1: Instalar Dependências
```bash
cd backend
npm install
```

### Passo 2: Configurar Banco de Dados
```bash
# Criar arquivo .env (se não existir)
# O arquivo .env.example já tem as configurações

# Rodar migrações
npm run prisma:migrate
# Quando perguntar o nome: init

# Gerar Prisma Client
npm run prisma:generate
```

### Passo 3: Iniciar Backend
```bash
npm run dev
```

Você verá:
```
🚀 Server is running on http://localhost:3001
📚 API Health: http://localhost:3001/api/health
📧 Ethereal Email configurado automaticamente
```

### Passo 4: Iniciar Frontend (outro terminal)
```bash
# Na raiz do projeto
npm run dev
```

---

## 📧 Como Funciona o Email

### Desenvolvimento (Automático)
Quando você criar uma barbearia, o sistema:
1. Gera um convite automaticamente
2. Configura Ethereal Email automaticamente
3. Envia o email
4. **Mostra no console o link para ver o email**

Exemplo no console:
```
📧 Preview do email: https://ethereal.email/message/waaaa...
   Acesse este link para ver o email enviado
```

### Produção (SMTP Real)
Edite `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
EMAIL_FROM="Groom Guru <noreply@groomguru.com>"
```

---

## 🧪 Testar o Fluxo Completo

### 1. Criar Barbearia (via API ou Frontend)

**Via Frontend:**
- Acesse: http://localhost:5173/admin
- Clique em "Nova Barbearia"
- Preencha os dados (inclua um email!)
- Clique em "Cadastrar Barbearia"

**Via API:**
```bash
POST http://localhost:3001/api/admin/barbearias
Content-Type: application/json

{
  "nome": "Barbearia do João",
  "cnpjCpf": "12.345.678/0001-90",
  "responsavel": "João Silva",
  "plano": "premium",
  "email": "joao@barbearia.com",
  "telefone": "(11) 99999-9999"
}
```

### 2. Verificar Email
- **Ethereal:** Veja o link no console do backend
- **SMTP Real:** Verifique a caixa de entrada

### 3. Ativar Conta
- Acesse o link do email
- Preencha: Nome, Email, Senha
- ✅ Conta criada!

---

## 📋 Resposta da API ao Criar Barbearia

```json
{
  "id": "uuid-da-barbearia",
  "nome": "Barbearia do João",
  "cnpjCpf": "12.345.678/0001-90",
  "responsavel": "João Silva",
  "plano": "premium",
  "status": "em_teste",
  "email": "joao@barbearia.com",
  "convite": {
    "id": "uuid-do-convite",
    "token": "token-gerado",
    "expiraEm": "2024-01-09T...",
    "linkAtivacao": "http://localhost:5173/ativar-conta?token=..."
  },
  "emailEnviado": true,
  "emailInfo": {
    "messageId": "...",
    "previewUrl": "https://ethereal.email/..." // Se usar Ethereal
  }
}
```

---

## 🗄️ Visualizar Dados

```bash
cd backend
npm run prisma:studio
```

Abre em: http://localhost:5555

---

## 📁 Arquivos Criados/Modificados

### Backend
- ✅ `backend/src/services/emailService.ts` - Serviço de email
- ✅ `backend/src/controllers/barbeariasController.ts` - Gera convite automaticamente
- ✅ `backend/package.json` - Adicionado nodemailer
- ✅ `backend/.env.example` - Exemplo de configuração
- ✅ `backend/scripts/setup-db.js` - Script de setup
- ✅ `backend/README_SETUP.md` - Documentação

### Frontend
- ✅ Já estava pronto! O frontend já cria barbearia via API

---

## ✅ Checklist de Funcionamento

- [ ] Backend rodando (porta 3001)
- [ ] Frontend rodando (porta 5173)
- [ ] Banco de dados criado (dev.db)
- [ ] Migrações rodadas
- [ ] Criar barbearia com email
- [ ] Ver link de preview do email no console
- [ ] Acessar link de ativação
- [ ] Criar conta do dono
- [ ] Verificar no Prisma Studio

---

## 🎉 Pronto!

Agora quando você criar uma barbearia:
1. ✅ Convite é gerado automaticamente
2. ✅ Email é enviado automaticamente
3. ✅ Dono recebe link para criar conta
4. ✅ Sistema está funcionando end-to-end!





