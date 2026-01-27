const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bruno = await prisma.profissional.findFirst({
        where: { nome: { contains: 'Bruno' } },
        select: { id: true, nome: true, barbeariaId: true }
    });
    console.log(JSON.stringify(bruno, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
