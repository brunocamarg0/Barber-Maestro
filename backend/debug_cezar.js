const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- BUSCANDO AGENDAMENTOS DE CEZAR CAMARGO ---');

    // Buscar agendamentos que contenham "Cezar" no nome do cliente
    const agendamentos = await prisma.agendamento.findMany({
        where: {
            cliente: {
                contains: 'Cezar',
                mode: 'insensitive'
            }
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

    agendamentos.forEach(a => {
        console.log(`\nID: ${a.id}`);
        console.log(`Cliente: ${a.cliente}`);
        console.log(`Status: ${a.status}`);
        console.log(`Data: ${a.data}`);
        console.log(`Horário: ${a.horario}`);
        console.log(`Serviço: ${a.servico?.nome} (R$ ${a.servico?.preco})`);
        console.log(`Profissionais vinculados: ${a.profissionais.length}`);
        a.profissionais.forEach(p => {
            console.log(`  - ${p.profissional.nome} (ID: ${p.profissional.id})`);
        });
    });

    // Se houver agendamentos sem profissional, vamos ver se existem profissionais na barbearia
    if (agendamentos.length > 0) {
        const barbeariaId = agendamentos[0].barbeariaId;
        const profissionais = await prisma.profissional.findMany({
            where: { barbeariaId }
        });
        console.log(`\nProfissionais cadastrados na barbearia (${barbeariaId}):`);
        profissionais.forEach(p => console.log(` - ${p.nome} (ID: ${p.id})`));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
