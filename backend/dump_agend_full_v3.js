const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const barbeariaId = '092806ee-517b-4029-9e80-d6211843b018';
    const dataInicio = new Date('2026-01-19T00:00:00-03:00');
    const dataFim = new Date('2026-01-19T23:59:59-03:00');

    const agendamentos = await prisma.agendamento.findMany({
        where: {
            barbeariaId,
            data: {
                gte: dataInicio,
                lte: dataFim,
            },
        },
        include: {
            profissionais: {
                include: {
                    profissional: true
                }
            },
            servico: true,
        },
        orderBy: {
            horario: 'asc',
        },
    });

    console.log(JSON.stringify(agendamentos, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
