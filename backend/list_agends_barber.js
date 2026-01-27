const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const barbeariaId = '2c43d93b-fd36-4ed3-b723-2f68e681a1ce';
    console.log(`--- AGENDAMENTOS DA BARBEARIA ${barbeariaId} ---`);
    const agends = await prisma.agendamento.findMany({
        where: { barbeariaId },
        orderBy: { createdAt: 'desc' },
        take: 10
    });
    agends.forEach(a => {
        console.log(`ID: ${a.id} | Cliente: ${a.cliente} | Status: ${a.status} | Data: ${a.data}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
