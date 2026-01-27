const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const barbeariaId = '2c43d93b-fd36-4ed3-b723-2f68e681a1ce';
    console.log(`--- PROFISSIONAIS DA BARBEARIA ${barbeariaId} ---`);
    const profs = await prisma.profissional.findMany({
        where: { barbeariaId }
    });
    profs.forEach(p => {
        console.log(`ID: ${p.id} | Nome: ${p.nome}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
