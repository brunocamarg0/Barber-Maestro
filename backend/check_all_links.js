const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- RELATÓRIO DE VÍNCULOS NEON ---');
    const data = await prisma.agendamento.findMany({
        take: 100,
        include: {
            _count: {
                select: { profissionais: true }
            }
        }
    });

    data.forEach(a => {
        if (a._count.profissionais > 0) {
            console.log(`[VÍNCULO ENCONTRADO] Agendamento: ${a.id} | Cliente: ${a.cliente} | Profissionais: ${a._count.profissionais}`);
        }
    });

    const countTotal = await prisma.agendamentoProfissional.count();
    console.log(`Total AgendamentoProfissional: ${countTotal}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
