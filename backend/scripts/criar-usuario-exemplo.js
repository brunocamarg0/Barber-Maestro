const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function criarUsuarioExemplo() {
  try {
    console.log('🚀 Criando usuário exemplo para Wesley...');

    // Dados do usuário
    const email = 'wesley.teste@hotmail.com';
    const senha = '123teste';
    const nome = 'Wesley';

    // Verificar se o email já existe
    const usuarioExistente = await prisma.usuarioDono.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      console.log('⚠️  Usuário com este email já existe!');
      console.log('   ID:', usuarioExistente.id);
      console.log('   Nome:', usuarioExistente.nome);
      console.log('   Barbearia ID:', usuarioExistente.barbeariaId);
      return;
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Criar barbearia primeiro
    const dataVencimento = new Date();
    dataVencimento.setMonth(dataVencimento.getMonth() + 1); // 1 mês a partir de hoje

    const barbearia = await prisma.barbearia.create({
      data: {
        nome: 'Barbearia do Wesley',
        cnpjCpf: '12345678000190',
        responsavel: 'Wesley',
        plano: 'premium',
        status: 'ativa',
        dataCriacao: new Date(),
        dataVencimento: dataVencimento,
        email: email,
        telefone: '(11) 99999-9999',
        endereco: 'Rua Exemplo, 123 - São Paulo, SP',
      },
    });

    console.log('✅ Barbearia criada:', barbearia.id);
    console.log('   Nome:', barbearia.nome);

    // Criar usuário dono
    const dono = await prisma.usuarioDono.create({
      data: {
        nome: nome,
        email: email,
        senha: senhaHash,
        barbeariaId: barbearia.id,
        ativo: true,
        emailVerificado: true,
      },
    });

    console.log('✅ Usuário dono criado com sucesso!');
    console.log('   ID:', dono.id);
    console.log('   Nome:', dono.nome);
    console.log('   Email:', dono.email);
    console.log('   Barbearia ID:', dono.barbeariaId);
    console.log('');
    console.log('📋 Credenciais de acesso:');
    console.log('   Email:', email);
    console.log('   Senha:', senha);
    console.log('');
    console.log('🎉 Usuário exemplo criado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar usuário exemplo:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

criarUsuarioExemplo();
