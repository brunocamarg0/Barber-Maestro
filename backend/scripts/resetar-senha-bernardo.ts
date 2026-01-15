/**
 * Script para resetar senha do email bernardostrabelli@gmail.com
 * 
 * Uso: npx tsx backend/scripts/resetar-senha-bernardo.ts
 */

import prisma from '../src/lib/prisma';
import { hashSenha } from '../src/utils/password';

async function resetarSenhaBernardo() {
  try {
    const email = 'bernardostrabelli@gmail.com';
    const novaSenha = 'Bernardo123!@#';
    
    console.log('🔐 Iniciando reset de senha...');
    console.log('📧 Email:', email);
    
    // Verificar se é dono ou cliente
    const dono = await prisma.usuarioDono.findUnique({
      where: { email },
    });
    
    const cliente = dono ? null : await prisma.cliente.findUnique({
      where: { email },
    });
    
    if (!dono && !cliente) {
      console.error('❌ Email não encontrado no banco de dados!');
      console.error('❌ Verifique se o email está cadastrado como dono ou cliente');
      process.exit(1);
    }
    
    const tipo = dono ? 'dono' : 'cliente';
    console.log('✅ Tipo de conta:', tipo);
    
    // Hash da nova senha
    const senhaHash = await hashSenha(novaSenha);
    
    // Atualizar senha
    if (tipo === 'dono') {
      await prisma.usuarioDono.update({
        where: { id: dono!.id },
        data: { senha: senhaHash },
      });
      console.log('✅ Senha atualizada para dono:', email);
    } else {
      await prisma.cliente.update({
        where: { id: cliente!.id },
        data: { senha: senhaHash },
      });
      console.log('✅ Senha atualizada para cliente:', email);
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ SENHA RESETADA COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📧 Email:', email);
    console.log('🔐 Nova Senha:', novaSenha);
    console.log('👤 Tipo:', tipo);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('⚠️ IMPORTANTE: Guarde esta senha em local seguro!');
    console.log('⚠️ Você pode alterá-la após fazer login.');
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetarSenhaBernardo();

