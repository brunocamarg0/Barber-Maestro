const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const profId = '4227476b-0b66-409d-8de1-2c43d93bfd36';
    console.log(`--- AGENDAMENTOS PARA PROFISSIONAL ${profId} ---`);
    const links = await prisma.agendamentoProfissional.findMany({
        where: { profissionalId: profId },
        include: {
            agendamento: true
        }
    });
    console.log(`Encontrados ${links.length} vínculos.`);
    links.forEach(l => {
        console.log(`Agendamento ID: ${l.agendamento.id} | Cliente: ${l.agendamento.cliente} | Status: ${l.agendamento.status} | Data: ${l.agendamento.data}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
