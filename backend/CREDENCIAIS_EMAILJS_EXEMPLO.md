# 🔑 Credenciais EmailJS do Projeto de Referência

Estas são as credenciais do projeto `landing-page-maker-buddy` que você já configurou:

```env
EMAILJS_SERVICE_ID=service_vrzylpd
EMAILJS_TEMPLATE_ID=template_4z6p82h
EMAILJS_PUBLIC_KEY=rgAjq_3XpUqKn1kP5
```

## ⚠️ IMPORTANTE

Você pode usar as mesmas credenciais OU criar novas credenciais específicas para o Groom Guru.

### Opção 1: Usar as mesmas credenciais (mais rápido)

Se você quiser usar as mesmas credenciais do projeto de referência:

1. Acesse o Railway → Seu projeto → Backend → Variables
2. Adicione estas variáveis:

```env
EMAILJS_SERVICE_ID=service_vrzylpd
EMAILJS_TEMPLATE_ID=template_4z6p82h
EMAILJS_PUBLIC_KEY=rgAjq_3XpUqKn1kP5
```

**⚠️ ATENÇÃO:** Você precisará criar um novo template no EmailJS para recuperação de senha, ou adaptar o template existente.

### Opção 2: Criar novas credenciais (recomendado)

Para manter as coisas organizadas, é melhor criar um novo template no EmailJS especificamente para recuperação de senha do Groom Guru:

1. Siga o guia em `CONFIGURAR_EMAILJS.md`
2. Crie um novo template com o HTML fornecido
3. Use as novas credenciais no Railway

## 📝 Template do EmailJS

O template precisa ter estas variáveis:

- `{{to_email}}` - Email do destinatário
- `{{to_name}}` - Nome do destinatário
- `{{subject}}` - Assunto do email
- `{{senha_nova}}` - Nova senha gerada
- `{{tipo_usuario}}` - 'dono' ou 'cliente'
- `{{nome_barbearia}}` - Nome da barbearia (opcional, apenas para dono)
- `{{message}}` - Mensagem completa (texto)

## 🚀 Próximos Passos

1. Configure as variáveis no Railway
2. Crie ou adapte o template no EmailJS
3. Teste a recuperação de senha
4. Verifique os logs para confirmar que EmailJS está sendo usado

