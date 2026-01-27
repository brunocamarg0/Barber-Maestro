const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const dataInicio = new Date('2026-01-19T00:00:00-03:00');
    const dataFim = new Date('2026-01-19T23:59:59-03:00');

    const links = await prisma.agendamentoProfissional.findMany({
        where: {
            agendamento: {
                data: {
                    gte: dataInicio,
                    lte: dataFim
                }
            }
        },
        include: {
            agendamento: true,
            profissional: true
        }
    });

    console.log('--- LINKS FOR 2026-01-19 ---');
    console.log(JSON.stringify(links, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
