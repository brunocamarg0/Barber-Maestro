# 👤 Criar Usuário de Teste para Painel do Dono

## 🎯 Credenciais de Teste

Após executar o script, você terá:

**📧 Email:** `dono@teste.com`  
**🔑 Senha:** `123456`  
**🏢 Barbearia:** `Barbearia Teste`

---

## 📋 Como Criar o Usuário

### Opção 1: Via Script (Recomendado)

1. **No terminal, dentro da pasta `backend`:**
   ```bash
   npm run criar-usuario-teste
   ```

2. **O script vai:**
   - Criar uma barbearia de teste
   - Criar um usuário dono
   - Mostrar as credenciais

### Opção 2: Via Cadastro no Frontend

1. Acesse: `https://groom-guru-platform.vercel.app/cadastro?tipo=dono`
2. Preencha:
   - Nome da Barbearia: `Barbearia Teste`
   - Nome do contato: `João Silva`
   - Telefone: `11999999999`
   - Email: `dono@teste.com`
   - Senha: `123456`
3. Clique em **CADASTRAR**

---

## ✅ Verificar se Funcionou

### 1. Testar Login

1. Acesse: `https://groom-guru-platform.vercel.app/login`
2. Selecione aba **"Dono"**
3. Use:
   - Email: `dono@teste.com`
   - Senha: `123456`
4. Clique em **ENTRAR**

### 2. Verificar no Banco de Dados

Se tiver acesso ao Prisma Studio:

```bash
cd backend
npm run prisma:studio
```

Procure por:
- **Barbearia:** "Barbearia Teste"
- **UsuarioDono:** email "dono@teste.com"

---

## 🔄 Se o Usuário Já Existir

Se você executar o script e o usuário já existir:

- O script vai informar que já existe
- Use as mesmas credenciais:
  - Email: `dono@teste.com`
  - Senha: `123456`

---

## 🎯 Dados do Usuário de Teste

**Barbearia:**
- Nome: `Barbearia Teste`
- CNPJ: `12.345.678/0001-90`
- Responsável: `João Silva`
- Email: `teste@barbearia.com`
- Telefone: `11999999999`
- Endereço: `Rua Teste, 123 - São Paulo, SP`
- Plano: `basico`
- Status: `em_teste`

**Dono:**
- Nome: `João Silva`
- Email: `dono@teste.com`
- Senha: `123456` (hash: bcrypt)
- Ativo: `true`
- Email Verificado: `true`

---

## 🆘 Se Não Funcionar

### Erro: "Cannot find module"

1. Certifique-se de estar na pasta `backend`
2. Execute: `npm install`
3. Tente novamente

### Erro: "Database connection failed"

1. Verifique se `DATABASE_URL` está configurada
2. Verifique se o Supabase está ativo
3. Teste a conexão

### Erro: "Email já existe"

- Use as credenciais existentes:
  - Email: `dono@teste.com`
  - Senha: `123456`

---

**Execute o script e use as credenciais para testar!** 🚀

