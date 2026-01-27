const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const dataInicio = new Date('2026-01-19T00:00:00-03:00');
    const dataFim = new Date('2026-01-19T23:59:59-03:00');

    console.log(`Auditing between ${dataInicio.toISOString()} and ${dataFim.toISOString()}`);

    const agendamentos = await prisma.agendamento.findMany({
        where: {
            data: {
                gte: dataInicio,
                lte: dataFim
            }
        },
        include: {
            servico: true,
            profissionais: {
                include: {
                    profissional: true
                }
            }
        }
    });

    console.log(`\nCOUNT: ${agendamentos.length}`);
    const allLinks = await prisma.agendamentoProfissional.findMany({
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

    console.log(`\nLINKS FOUND: ${allLinks.length}`);
    allLinks.forEach(l => {
        console.log(`Link: Agend[${l.agendamentoId.substring(0, 8)}] -> Prof[${l.profissionalId.substring(0, 8)} - ${l.profissional.nome}]`);
    });

    const agendamentosWithProfs = await prisma.agendamento.findMany({
        where: {
            data: {
                gte: dataInicio,
                lte: dataFim
            }
        },
        include: {
            servico: true,
            profissionais: true
        }
    });

    console.log(`\nAGENDAMENTOS WITHOUT PROFS:`);
    agendamentosWithProfs.filter(a => a.profissionais.length === 0).forEach(a => {
        console.log(`- [${a.status}] ${a.cliente} | R$${a.servico?.preco || 0} | ID: ${a.id.substring(0, 8)}`);
    });

    agendamentos.forEach(a => {
        const pId = a.profissionais.length > 0 ? a.profissionais[0].profissionalId.substring(0, 8) : 'NONE';
        const pNome = a.profissionais.length > 0 ? a.profissionais[0].profissional.nome : 'NONE';
        console.log(`[${a.status}] ${a.cliente} | ${pNome} (${pId}) | R$${a.servico?.preco || 0}`);
    });

    const brunoId = '4227476b-0b66-409d-8de1-da7720399620';
    const brunoAgends = agendamentos.filter(a => a.profissionais.some(p => p.profissionalId === brunoId));

    console.log(`\nCOUNT FOR BRUNO: ${brunoAgends.length}`);

    brunoAgends.forEach(a => {
        console.log(`[${a.status}] ${a.cliente} | R$${a.servico?.preco || 0}`);
    });

    const eligivel = brunoAgends.filter(a => ['confirmado', 'concluido'].includes(a.status));
    console.log(`ELIGIBLE: ${eligivel.length}`);

    const allProfs = await prisma.profissional.findMany({ select: { id: true, nome: true } });
    console.log(`\nPROFS:`);
    allProfs.forEach(p => console.log(`${p.nome} (${p.id.substring(0, 8)})`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
