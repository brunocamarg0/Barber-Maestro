// Script para criar usuário de teste para o painel do dono
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function criarUsuarioTeste() {
  try {
    console.log('🔧 Criando usuário de teste...');

    // Hash da senha
    const senhaHash = await bcrypt.hash('123456', 10);

    // Calcular data de vencimento (30 dias)
    const dataVencimento = new Date();
    dataVencimento.setDate(dataVencimento.getDate() + 30);

    // Criar barbearia e dono em transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Criar barbearia
      const barbearia = await tx.barbearia.create({
        data: {
          nome: 'Barbearia Teste',
          cnpjCpf: '12.345.678/0001-90',
          responsavel: 'João Silva',
          plano: 'basico',
          email: 'teste@barbearia.com',
          telefone: '11999999999',
          endereco: 'Rua Teste, 123 - São Paulo, SP',
          dataVencimento,
          status: 'em_teste',
        },
      });

      // Criar dono
      const dono = await tx.usuarioDono.create({
        data: {
          nome: 'João Silva',
          email: 'dono@teste.com',
          senha: senhaHash,
          barbeariaId: barbearia.id,
          ativo: true,
          emailVerificado: true,
        },
      });

      return { barbearia, dono };
    });

    console.log('✅ Usuário de teste criado com sucesso!');
    console.log('\n📋 Credenciais de Acesso:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: dono@teste.com');
    console.log('🔑 Senha: 123456');
    console.log('🏢 Barbearia: Barbearia Teste');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Use essas credenciais para fazer login no painel do dono!');

    await prisma.$disconnect();
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário de teste:', error);
    
    // Se o usuário já existe, informar
    if (error.code === 'P2002') {
      console.log('\n⚠️  Usuário já existe!');
      console.log('📧 Email: dono@teste.com');
      console.log('🔑 Senha: 123456');
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

criarUsuarioTeste();

