const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const barbeariaId = '092806ee-517b-4029-9e80-d6211843b018';
    const date = '2026-01-19';

    const agendamentos = await prisma.agendamento.findMany({
        where: {
            barbeariaId,
            data: {
                gte: new Date('2026-01-19T00:00:00Z'),
                lte: new Date('2026-01-19T23:59:59Z'),
            },
        },
        include: {
            profissionais: {
                include: {
                    profissional: true
                }
            },
            servico: true,
            cliente: true
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
