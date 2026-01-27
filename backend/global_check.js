const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- BUSCA GLOBAL DE VÍNCULOS ---');
    const relacoes = await prisma.agendamentoProfissional.findMany({
        take: 100,
        include: {
            agendamento: true,
            profissional: true
        }
    });
    console.log(`Total encontrado: ${relacoes.length}`);
    relacoes.forEach(r => {
        console.log(`Barbearia: ${r.agendamento.barbeariaId} | Cliente: ${r.agendamento.cliente} | Profissional: ${r.profissional.nome}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
