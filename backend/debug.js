const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DATA CHECK ---');
    const logs = await prisma.agendamento.findMany({
        take: 5,
        include: {
            profissionais: true,
            servico: true
        }
    });
    console.log(JSON.stringify(logs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
