# 📧 Configuração do EmailJS para Recuperação de Senha

## Por que EmailJS?

EmailJS é uma solução mais simples e confiável que o SMTP tradicional porque:
- ✅ **Não precisa de configuração SMTP complexa**
- ✅ **Funciona bem com Railway (sem bloqueios de firewall)**
- ✅ **Gratuito até 200 emails/mês**
- ✅ **Não precisa de "Senha de App" ou configurações TLS**
- ✅ **Mais confiável que Gmail/Outlook para produção**

## 🚀 Passo a Passo Completo

### 1. Criar Conta no EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"** (canto superior direito)
3. Preencha seus dados e crie a conta
4. Faça login na sua conta

### 2. Configurar Serviço de Email

1. No dashboard, clique em **"Email Services"** no menu lateral
2. Clique em **"Add New Service"**
3. Escolha seu provedor de email:
   - **Gmail** (recomendado)
   - **Outlook/Hotmail**
   - **Yahoo**
   - **Outros**

#### ⚙️ Como configurar Gmail:

1. Selecione **"Gmail"**
2. Clique em **"Connect Account"**
3. Autorize o EmailJS a acessar sua conta Gmail
4. Após conectar, você verá o **Service ID** (ex: `service_abc123`)
5. **Anote este Service ID**

### 3. Criar Template de Email

1. No menu lateral, clique em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Configure o template:

#### 📧 Template HTML (copie e cole):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .senha-box {
      background: #fff;
      border: 2px dashed #667eea;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
      border-radius: 5px;
    }
    .senha {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
      letter-spacing: 2px;
      font-family: monospace;
    }
    .button {
      display: inline-block;
      padding: 15px 30px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 12px;
    }
    .info {
      background: #e7f3ff;
      border-left: 4px solid #2196F3;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Recuperação de Senha</h1>
    </div>
    <div class="content">
      <p>Olá <strong>{{to_name}}</strong>,</p>
      
      <p>Recebemos uma solicitação de recuperação de senha para sua conta{{#nome_barbearia}} na barbearia <strong>{{nome_barbearia}}</strong>{{/nome_barbearia}}.</p>
      
      <p>Sua nova senha foi gerada automaticamente. Use as credenciais abaixo para fazer login:</p>
      
      <div class="senha-box">
        <p style="margin: 0 0 10px 0; color: #666;">Sua nova senha:</p>
        <div class="senha">{{senha_nova}}</div>
      </div>
      
      <div class="info">
        <strong>ℹ️ Informação:</strong> Esta senha é sua nova senha oficial. Você pode mantê-la ou alterá-la nas configurações da sua conta quando desejar.
      </div>
      
      <p>Use seu email (<strong>{{to_email}}</strong>) e a senha acima para fazer login.</p>
      
      <p><strong>⚠️ Importante:</strong> Se você não solicitou esta recuperação de senha, entre em contato conosco imediatamente.</p>
    </div>
    <div class="footer">
      <p>Este é um email automático, por favor não responda.</p>
      <p>© 2025 Groom Guru Platform</p>
    </div>
  </div>
</body>
</html>
```

#### ⚙️ Configurações do Template:

1. **Nome do Template:** "Recuperação de Senha Groom Guru"
2. **Assunto:** `{{subject}}`
3. **Conteúdo:** Cole o HTML acima
4. **Salvar** o template
5. **Anote o Template ID** (ex: `template_xyz789`)

### 4. Obter Chave Pública (Public Key)

1. No menu lateral, clique em **"Account"**
2. Clique em **"API Keys"**
3. Você verá sua **Public Key** (ex: `user_def456`)
4. **Copie e anote esta chave**

### 5. Configurar no Railway

1. Acesse o Railway → Seu projeto → Backend → **Variables**
2. Adicione estas variáveis de ambiente:

```env
EMAILJS_SERVICE_ID=service_vrzylpd
EMAILJS_TEMPLATE_ID=template_4z6p82h
EMAILJS_PUBLIC_KEY=rgAjq_3XpUqKn1kP5
```

**⚠️ IMPORTANTE:** Substitua os valores acima pelos seus próprios valores obtidos no EmailJS!

### 6. Como Funciona

O sistema tentará usar EmailJS primeiro. Se EmailJS estiver configurado e funcionando, ele será usado. Se não estiver configurado ou falhar, o sistema automaticamente usará nodemailer (SMTP) como fallback.

### 7. Testar

1. Após configurar as variáveis no Railway, o serviço reiniciará automaticamente
2. Teste a recuperação de senha no frontend
3. Verifique se o email chegou na caixa de entrada
4. Verifique os logs do Railway para confirmar que EmailJS foi usado

## 📋 Resumo das Credenciais

| Credencial | Onde Encontrar | Variável de Ambiente |
|------------|----------------|---------------------|
| **Service ID** | Email Services → Seu Serviço | `EMAILJS_SERVICE_ID` |
| **Template ID** | Email Templates → Seu Template | `EMAILJS_TEMPLATE_ID` |
| **Public Key** | Account → API Keys | `EMAILJS_PUBLIC_KEY` |

## ✅ Verificação

Após configurar, os logs do Railway devem mostrar:

```
📧 [EMAIL] Tentando enviar via EmailJS...
✅ [EMAIL] Email enviado via EmailJS com sucesso!
✅ [EMAIL] Status: 200
```

## 🆘 Problemas Comuns

### ❌ "Service not found"
- Verifique se o `EMAILJS_SERVICE_ID` está correto
- Confirme se o serviço está conectado no EmailJS

### ❌ "Template not found"
- Verifique se o `EMAILJS_TEMPLATE_ID` está correto
- Confirme se o template foi salvo

### ❌ "Invalid API key"
- Verifique se o `EMAILJS_PUBLIC_KEY` está correto
- Confirme se copiou a chave completa

### ❌ Email não chega
- Verifique se o serviço de email (Gmail/Outlook) está conectado no EmailJS
- Verifique se o email de destino está correto
- Verifique a caixa de spam

## 🎉 Vantagens do EmailJS

- ✅ **Mais simples:** Não precisa configurar SMTP
- ✅ **Mais confiável:** Funciona bem com Railway
- ✅ **Gratuito:** 200 emails/mês grátis
- ✅ **Sem bloqueios:** Não tem problemas de firewall
- ✅ **Fácil de configurar:** Apenas 3 variáveis de ambiente

---

**💡 Dica:** Mantenha suas credenciais seguras e não as compartilhe publicamente!

