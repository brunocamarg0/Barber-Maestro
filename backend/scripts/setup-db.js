/**
 * Script para configurar o banco de dados
 * Execute: node scripts/setup-db.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando banco de dados...\n');

// Verificar se .env existe
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env...');
  const envExample = path.join(__dirname, '..', '.env.example');
  if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envPath);
    console.log('✅ Arquivo .env criado a partir do .env.example\n');
  } else {
    // Criar .env básico
    fs.writeFileSync(envPath, `DATABASE_URL="file:./dev.db"
PORT=3001
FRONTEND_URL=http://localhost:5173
`);
    console.log('✅ Arquivo .env criado com configurações padrão\n');
  }
} else {
  console.log('✅ Arquivo .env já existe\n');
}

// Rodar migrações
console.log('📦 Rodando migrações do Prisma...');
try {
  execSync('npx prisma migrate dev --name init', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  console.log('\n✅ Migrações concluídas!\n');
} catch (error) {
  console.error('\n❌ Erro ao rodar migrações:', error.message);
  process.exit(1);
}

// Gerar Prisma Client
console.log('🔨 Gerando Prisma Client...');
try {
  execSync('npx prisma generate', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  console.log('\n✅ Prisma Client gerado!\n');
} catch (error) {
  console.error('\n❌ Erro ao gerar Prisma Client:', error.message);
  process.exit(1);
}

console.log('🎉 Banco de dados configurado com sucesso!');
console.log('\n📚 Próximos passos:');
console.log('   1. npm install (se ainda não instalou)');
console.log('   2. npm run dev (para iniciar o servidor)');
console.log('   3. npm run prisma:studio (opcional - para ver os dados)');

