const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- BARBEARIAS NO BANCO ---');
    const b = await prisma.barbearia.findMany({
        select: { id: true, nome: true }
    });
    console.log(JSON.stringify(b, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
