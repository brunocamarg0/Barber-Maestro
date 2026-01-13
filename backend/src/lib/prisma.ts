import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// Tratamento de erros de conexão
prisma.$connect().catch((error) => {
  console.error('❌ Erro ao conectar com banco de dados:', error);
  // Não encerrar o processo, apenas logar
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;





