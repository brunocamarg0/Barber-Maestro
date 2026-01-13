// Script simples para testar conexão com Supabase
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testarConexao() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Conexão OK! Resultado:', result);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testarConexao();

