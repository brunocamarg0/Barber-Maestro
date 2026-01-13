#!/bin/bash
# Script para executar migrações do Prisma no Railway

echo "🔧 Executando migrações do Prisma..."

# Verificar se DATABASE_URL está configurada
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERRO: DATABASE_URL não está configurada!"
  exit 1
fi

echo "✅ DATABASE_URL configurada"

# Executar migrações
echo "📦 Executando prisma db push..."
npx prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
  echo "✅ Migrações executadas com sucesso!"
else
  echo "❌ Erro ao executar migrações"
  exit 1
fi

