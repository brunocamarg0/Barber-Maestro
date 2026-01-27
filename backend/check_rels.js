const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- RELAÇÕES AGENDAMENTO-PROFISSIONAL ---');

    const relacoes = await prisma.agendamentoProfissional.findMany({
        take: 10,
        include: {
            agendamento: true,
            profissional: true
        }
    });

    console.log(`Total relações encontradas: ${relacoes.length}`);
    relacoes.forEach(r => {
        console.log(`Agendamento: ${r.agendamento.cliente} | Profissional: ${r.profissional.nome}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
