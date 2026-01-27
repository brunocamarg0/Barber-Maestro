const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const barbeariaId = '2c43d9ed-4ed3-b723-2f68e681a1ce';
    console.log(`--- AUDITORIA DE VÍNCULOS: BARBEARIA ${barbeariaId} ---`);

    const agendamentos = await prisma.agendamento.findMany({
        where: { barbeariaId },
        include: {
            profissionais: true
        }
    });

    const total = agendamentos.length;
    const semProfissional = agendamentos.filter(a => a.profissionais.length === 0).length;
    const comProfissional = total - semProfissional;

    console.log(`Total de agendamentos: ${total}`);
    console.log(`Com profissional vinculado: ${comProfissional}`);
    console.log(`SEM profissional vinculado: ${semProfissional}`);

    if (semProfissional > 0) {
        console.log('\nExemplos de agendamentos SEM profissional:');
        agendamentos.filter(a => a.profissionais.length === 0).slice(0, 5).forEach(a => {
            console.log(`- ID: ${a.id} | Cliente: ${a.cliente} | Status: ${a.status} | Criado em: ${a.createdAt}`);
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
