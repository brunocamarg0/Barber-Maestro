const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DUMP AGENDAMENTO ---');
    const agendamento = await prisma.agendamento.findFirst();
    console.log(JSON.stringify(agendamento, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
