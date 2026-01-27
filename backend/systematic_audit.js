const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- AUDITORIA SISTEMÁTICA ---');

    const agendamentos = await prisma.agendamento.findMany({
        take: 50,
        select: { id: true, cliente: true }
    });

    console.log(`Verificando ${agendamentos.length} agendamentos...`);

    for (const ag of agendamentos) {
        const links = await prisma.agendamentoProfissional.findMany({
            where: { agendamentoId: ag.id },
            include: { profissional: true }
        });

        if (links.length > 0) {
            console.log(`[VÍNCULO] Agendamento: ${ag.cliente} (${ag.id}) -> Profissionais: ${links.map(l => l.profissional.nome).join(', ')}`);
        } else {
            // Silencioso para não poluir
        }
    }

    const totalLinks = await prisma.agendamentoProfissional.count();
    console.log(`Total geral de vínculos no banco: ${totalLinks}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
