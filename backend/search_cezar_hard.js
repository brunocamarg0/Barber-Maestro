const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- BUSCANDO QUALQUER MENÇÃO A CEZAR OU CAMARGO ---');

    const agendamentos = await prisma.agendamento.findMany({
        where: {
            OR: [
                { cliente: { contains: 'Cezar', mode: 'insensitive' } },
                { cliente: { contains: 'Camargo', mode: 'insensitive' } }
            ]
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

    console.log(`Encontrados ${agendamentos.length} agendamentos.`);

    if (agendamentos.length === 0) {
        console.log('Tentando buscar TODOS os agendamentos do dia de hoje (Jan 19, 2026)...');
        const hoje = new Date('2026-01-19T00:00:00-03:00');
        const amanha = new Date('2026-01-20T00:00:00-03:00');

        const hojeAgends = await prisma.agendamento.findMany({
            where: {
                data: {
                    gte: hoje,
                    lt: amanha
                }
            },
            include: {
                profissionais: { include: { profissional: true } }
            }
        });
        console.log(`Encontrados ${hojeAgends.length} agendamentos para hoje.`);
        hojeAgends.forEach(a => {
            console.log(`- ${a.cliente} | Status: ${a.status} | Profissionais: ${a.profissionais.length}`);
        });
    } else {
        agendamentos.forEach(a => {
            console.log(`\nID: ${a.id}`);
            console.log(`Cliente: ${a.cliente}`);
            console.log(`Status: ${a.status}`);
            console.log(`Data (ISO): ${a.data.toISOString()}`);
            console.log(`BarbeariaID: ${a.barbeariaId}`);
            console.log(`Profissionais vinculados: ${a.profissionais.length}`);
            a.profissionais.forEach(p => console.log(`  - ${p.profissional.nome}`));
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
