# Script para atualizar DATABASE_URL no .env

Write-Host "🔧 Atualizando DATABASE_URL no arquivo .env..." -ForegroundColor Yellow

# Solicitar a string de conexão
$databaseUrl = Read-Host "Cole a DATABASE_URL do Railway aqui"

# Verificar se o arquivo .env existe
if (Test-Path ".env") {
    # Ler conteúdo atual
    $content = Get-Content ".env" -Raw
    
    # Verificar se DATABASE_URL já existe
    if ($content -match "DATABASE_URL=") {
        # Substituir valor existente
        $content = $content -replace "DATABASE_URL=.*", "DATABASE_URL=`"$databaseUrl`""
        Write-Host "✅ DATABASE_URL atualizada no arquivo .env" -ForegroundColor Green
    } else {
        # Adicionar nova linha
        $content += "`nDATABASE_URL=`"$databaseUrl`""
        Write-Host "✅ DATABASE_URL adicionada ao arquivo .env" -ForegroundColor Green
    }
    
    # Salvar arquivo
    $content | Set-Content ".env" -NoNewline
} else {
    # Criar novo arquivo
    "DATABASE_URL=`"$databaseUrl`"" | Set-Content ".env"
    Write-Host "✅ Arquivo .env criado com DATABASE_URL" -ForegroundColor Green
}

Write-Host "`n✅ Arquivo .env atualizado!" -ForegroundColor Green
Write-Host "`n📋 Próximo passo: Execute 'npm run prisma:push'" -ForegroundColor Cyan

