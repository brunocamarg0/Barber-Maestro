import nodemailer from 'nodemailer';

// Cache para transporter
let transporterCache: nodemailer.Transporter | null = null;

// Configuração do transporter de email
// Para desenvolvimento, pode usar Ethereal Email (fake SMTP) ou configurar SMTP real
const createTransporter = async (): Promise<nodemailer.Transporter> => {
  // Se já tem cache, retorna
  if (transporterCache) {
    return transporterCache;
  }

  // Se tiver variáveis de ambiente configuradas, usa SMTP real
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporterCache = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporterCache;
  }

  // Para desenvolvimento: Ethereal Email (fake SMTP que funciona sem configuração)
  // Gera credenciais automaticamente
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporterCache = nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📧 Ethereal Email configurado automaticamente');
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);
    return transporterCache;
  } catch (error) {
    console.error('Erro ao criar conta Ethereal:', error);
    throw new Error('Não foi possível configurar o serviço de email');
  }
};

interface EnviarConviteParams {
  email: string;
  nomeBarbearia: string;
  nomeResponsavel: string;
  linkAtivacao: string;
  expiraEm: Date;
}

/**
 * Envia email com link de convite para ativação de conta
 */
export async function enviarEmailConvite(params: EnviarConviteParams) {
  const { email, nomeBarbearia, nomeResponsavel, linkAtivacao, expiraEm } = params;

  const transporter = createTransporter();

  const htmlTemplate = `
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bem-vindo ao Groom Guru!</h1>
        </div>
        <div class="content">
          <p>Olá <strong>${nomeResponsavel}</strong>,</p>
          
          <p>Sua barbearia <strong>${nomeBarbearia}</strong> foi cadastrada com sucesso em nossa plataforma!</p>
          
          <p>Para começar a usar o sistema, você precisa criar sua conta de acesso. Clique no botão abaixo para ativar sua conta:</p>
          
          <div style="text-align: center;">
            <a href="${linkAtivacao}" class="button">Ativar Minha Conta</a>
          </div>
          
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; font-size: 12px;">
            ${linkAtivacao}
          </p>
          
          <p><strong>⚠️ Importante:</strong> Este link expira em ${expiraEm.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}.</p>
          
          <p>Se você não solicitou este cadastro, pode ignorar este email.</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
          <p>© ${new Date().getFullYear()} Groom Guru Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textTemplate = `
    Bem-vindo ao Groom Guru!
    
    Olá ${nomeResponsavel},
    
    Sua barbearia ${nomeBarbearia} foi cadastrada com sucesso em nossa plataforma!
    
    Para começar a usar o sistema, você precisa criar sua conta de acesso. Acesse o link abaixo:
    
    ${linkAtivacao}
    
    ⚠️ Importante: Este link expira em ${expiraEm.toLocaleDateString('pt-BR')}.
    
    Se você não solicitou este cadastro, pode ignorar este email.
    
    © ${new Date().getFullYear()} Groom Guru Platform
  `;

  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Groom Guru" <noreply@groomguru.com>',
      to: email,
      subject: `Ative sua conta - ${nomeBarbearia}`,
      text: textTemplate,
      html: htmlTemplate,
    });

    console.log('✅ Email enviado:', info.messageId);
    
    // Se usar Ethereal, mostra o link de preview
    if (info.messageId) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('📧 Preview do email:', previewUrl);
        console.log('   Acesse este link para ver o email enviado');
      }
    }

    return {
      sucesso: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null,
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Erro ao enviar email de convite');
  }
}

/**
 * Gera credenciais Ethereal para desenvolvimento
 */
export async function gerarCredenciaisEthereal() {
  const testAccount = await nodemailer.createTestAccount();
  return {
    user: testAccount.user,
    pass: testAccount.pass,
    smtp: {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
    },
    preview: 'https://ethereal.email',
  };
}

