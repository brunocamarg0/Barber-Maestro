const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const barbeariaId = '092806ee-517b-4029-9e80-d6211843b018'; // Bruno's barbearia from previous script
    const date = '2026-01-19';

    const agendamentos = await prisma.agendamento.findMany({
        where: {
            barbeariaId,
            data: {
                gte: new Date(`${date}T00:00:00-03:00`),
                lte: new Date(`${date}T23:59:59.999-03:00`),
            },
        },
        include: {
            profissionais: true,
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
