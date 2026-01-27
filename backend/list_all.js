const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- LISTANDO TODA A BASE DE AGENDAMENTOS (LIMIT 10) ---');

    const agendamentos = await prisma.agendamento.findMany({
        take: 20,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            profissionais: {
                include: {
                    profissional: true
                }
            },
            servico: true
        }
    });

    console.log(`Encontrados ${agendamentos.length} agendamentos recentes.`);

    agendamentos.forEach(a => {
        console.log(`\nID: ${a.id}`);
        console.log(`Cliente: ${a.cliente}`);
        console.log(`Status: ${a.status}`);
        console.log(`Data: ${a.data}`);
        console.log(`Serviço: ${a.servico?.nome}`);
        console.log(`Profissionais vinculados: ${a.profissionais.length} (${a.profissionais.map(p => p.profissional.nome).join(', ')})`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
