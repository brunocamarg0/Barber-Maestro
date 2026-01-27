const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const barbeariaId = '2c43d93b-fd36-4ed3-b723-2f68e681a1ce';
    const agends = await prisma.agendamento.findMany({
        where: { barbeariaId },
        take: 10,
        select: { id: true, cliente: true, status: true, data: true }
    });
    console.log('RESULTS_START');
    agends.forEach(a => {
        console.log(`${a.id}|${a.cliente}|${a.status}|${a.data.toISOString()}`);
    });
    console.log('RESULTS_END');
}

main().catch(console.error).finally(() => prisma.$disconnect());
