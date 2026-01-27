const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- REPARO MANUAL DE TESTE ---');

    // Pegar o primeiro agendamento
    const agendamento = await prisma.agendamento.findFirst();
    if (!agendamento) {
        console.log('Nenhum agendamento encontrado!');
        return;
    }

    // Pegar o primeiro profissional da mesma barbearia
    const profissional = await prisma.profissional.findFirst({
        where: { barbeariaId: agendamento.barbeariaId }
    });

    if (!profissional) {
        console.log('Nenhum profissional encontrado para esta barbearia!');
        return;
    }

    console.log(`Tentando vincular Agendamento ${agendamento.id} ao Profissional ${profissional.id}...`);

    try {
        const link = await prisma.agendamentoProfissional.create({
            data: {
                agendamentoId: agendamento.id,
                profissionalId: profissional.id
            }
        });
        console.log('✅ Vínculo criado com sucesso:', link);

        // Verificar se aparece na query
        const check = await prisma.agendamentoProfissional.count();
        console.log('Total de relações agora:', check);
    } catch (err) {
        console.error('❌ Erro ao criar vínculo:', err);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
