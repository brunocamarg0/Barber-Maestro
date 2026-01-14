# 📧 Como Configurar SMTP Real no Railway

## ⚠️ Problema Atual

O sistema está usando **Ethereal Email** (SMTP de teste), que **NÃO envia emails reais**. Os emails só aparecem em https://ethereal.email para visualização.

## ✅ Solução: Configurar SMTP Real

### Opção 1: Gmail (Recomendado para começar)

1. **Acesse o Railway:**
   - Vá em: https://railway.app
   - Selecione seu projeto
   - Clique no serviço do backend
   - Vá em **"Variables"** (Variáveis de Ambiente)

2. **Adicione as seguintes variáveis:**

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=sua-senha-de-app
   EMAIL_FROM="Groom Guru <seu-email@gmail.com>"
   ```

3. **Para Gmail, você precisa criar uma "Senha de App":**
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "Email" e "Outro (nome personalizado)"
   - Digite: "Groom Guru"
   - Copie a senha gerada (16 caracteres)
   - Use essa senha no `SMTP_PASS` (NÃO use sua senha normal do Gmail!)

### Opção 2: Outlook/Hotmail

```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@hotmail.com
SMTP_PASS=sua-senha
EMAIL_FROM="Groom Guru <seu-email@hotmail.com>"
```

### Opção 3: SendGrid (Recomendado para produção)

1. Crie conta em: https://sendgrid.com
2. Crie uma API Key
3. Configure no Railway:

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=sua-api-key-do-sendgrid
EMAIL_FROM="Groom Guru <noreply@groomguru.com>"
```

### Opção 4: Mailgun

1. Crie conta em: https://www.mailgun.com
2. Configure no Railway:

```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@seu-dominio.mailgun.org
SMTP_PASS=sua-senha-do-mailgun
EMAIL_FROM="Groom Guru <noreply@seu-dominio.com>"
```

## 🔄 Após Configurar

1. **Salve as variáveis no Railway**
2. **O Railway vai reiniciar automaticamente**
3. **Verifique os logs** - deve aparecer:
   ```
   📧 [EMAIL] Configurando SMTP real para produção
   ✅ [EMAIL] SMTP real configurado com sucesso
   ```

4. **Teste novamente a recuperação de senha**
5. **O email deve chegar na caixa de entrada real!**

## ✅ Verificação

Após configurar, quando você solicitar recuperação de senha, os logs devem mostrar:
- `✅ [EMAIL] SMTP real configurado com sucesso`
- `✅ [EMAIL] Email enviado via SMTP real` (sem link do Ethereal)

Se ainda aparecer "Preview do email (Ethereal)", significa que as variáveis não foram configuradas corretamente.

## 🆘 Problemas Comuns

### "Erro ao enviar email"
- Verifique se as credenciais estão corretas
- Para Gmail, use Senha de App (não a senha normal)
- Verifique se a porta está correta (587 para TLS, 465 para SSL)

### "Email não chega"
- Verifique a pasta de spam
- Verifique se o `EMAIL_FROM` está correto
- Teste enviando para outro email

### "Ainda aparece Ethereal"
- Verifique se as variáveis foram salvas no Railway
- Verifique se o Railway reiniciou após salvar
- Verifique os logs para ver qual SMTP está sendo usado

