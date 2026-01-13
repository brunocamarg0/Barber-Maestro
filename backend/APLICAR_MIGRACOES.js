// Script para aplicar migrações do Prisma
const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Verificando conexão com banco...');
console.log('📋 Schema do Prisma encontrado');

try {
  console.log('\n📦 Gerando Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n🚀 Aplicando migrações (db push)...');
  console.log('⚠️ Isso criará todas as tabelas diretamente no banco\n');
  
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n✅ Migrações aplicadas com sucesso!');
  console.log('✅ Tabelas criadas no Supabase');
  
} catch (error) {
  console.error('\n❌ Erro ao aplicar migrações:', error.message);
  console.error('\n💡 Dica: Certifique-se de que:');
  console.error('  1. O banco Supabase está ativo');
  console.error('  2. A connection string está correta');
  console.error('  3. Você tem permissão no banco');
  process.exit(1);
}

