const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- BUSCANDO PROFISSIONAL ---');
    const profissionais = await prisma.profissional.findMany({
        select: { id: true, nome: true, barbeariaId: true, comissaoTipo: true, comissaoValor: true }
    });
    profissionais.forEach(p => {
        console.log(`${p.id} | ${p.nome} | ${p.comissaoTipo} | ${p.comissaoValor}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
