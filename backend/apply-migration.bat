@echo off
echo Aplicando migração do Prisma...
npx prisma migrate deploy
echo.
echo Gerando cliente Prisma...
npx prisma generate
echo.
echo Migração aplicada com sucesso!
pause
