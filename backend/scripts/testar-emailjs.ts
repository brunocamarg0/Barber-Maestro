/**
 * Script para testar se EmailJS está configurado corretamente
 * Execute: npm run testar-emailjs
 */

import emailjs from '@emailjs/nodejs';

const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID || '',
  PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY || '',
};

console.log('🔍 Verificando configuração do EmailJS...\n');

// Verificar se as variáveis estão configuradas
console.log('📋 Variáveis de ambiente:');
console.log(`  EMAILJS_SERVICE_ID: ${EMAILJS_CONFIG.SERVICE_ID ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`  EMAILJS_TEMPLATE_ID: ${EMAILJS_CONFIG.TEMPLATE_ID ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`  EMAILJS_PUBLIC_KEY: ${EMAILJS_CONFIG.PUBLIC_KEY ? '✅ Configurado' : '❌ Não configurado'}\n`);

if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
  console.error('❌ EmailJS não está configurado!');
  console.error('\n📝 Para configurar:');
  console.error('1. Acesse o Railway → Seu projeto → Backend → Variables');
  console.error('2. Adicione as variáveis:');
  console.error('   EMAILJS_SERVICE_ID=seu_service_id');
  console.error('   EMAILJS_TEMPLATE_ID=seu_template_id');
  console.error('   EMAILJS_PUBLIC_KEY=sua_public_key');
  console.error('\n📚 Veja o guia completo em: backend/CONFIGURAR_EMAILJS.md');
  process.exit(1);
}

// Testar envio de email
console.log('📧 Testando envio de email...\n');

const templateParams = {
  to_email: 'brunocamargocontato@hotmail.com',
  to_name: 'Bruno Camargo',
  subject: 'Teste de EmailJS - Groom Guru',
  message: 'Este é um email de teste para verificar se EmailJS está funcionando corretamente.',
  senha_nova: 'TESTE123',
  tipo_usuario: 'dono',
  nome_barbearia: 'Barbearia Teste',
};

emailjs
  .send(
    EMAILJS_CONFIG.SERVICE_ID,
    EMAILJS_CONFIG.TEMPLATE_ID,
    templateParams,
    {
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
    }
  )
  .then((response) => {
    console.log('✅ Email enviado com sucesso!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Text: ${response.text}`);
    console.log('\n📧 Verifique a caixa de entrada de brunocamargocontato@hotmail.com');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro ao enviar email:');
    console.error(`   Status: ${error.status || 'N/A'}`);
    console.error(`   Text: ${error.text || error.message || 'Erro desconhecido'}`);
    console.error('\n🔍 Possíveis causas:');
    console.error('   - Service ID incorreto');
    console.error('   - Template ID incorreto');
    console.error('   - Public Key incorreta');
    console.error('   - Template não configurado corretamente no EmailJS');
    console.error('   - Serviço de email não conectado no EmailJS');
    process.exit(1);
  });

