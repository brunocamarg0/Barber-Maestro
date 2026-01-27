import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Carregar .env da raiz
dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('--- DEBUG COMISSÕES (VERBOSE) ---');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

    try {
        const agendamentosCount = await prisma.agendamento.count();
        console.log('Total agendamentos:', agendamentosCount);

        const statsStatus = await prisma.agendamento.groupBy({
            by: ['status'],
            _count: true
        });
        console.log('Agendamentos por status:', statsStatus);

        const matchProfissional = await prisma.agendamento.findFirst({
            where: {
                profissionais: { some: {} }
            },
            include: {
                profissionais: { include: { profissional: true } },
                servico: true
            }
        });

        if (matchProfissional) {
            console.log('Exemplo de agendamento com profissional:');
            console.log('ID:', matchProfissional.id);
            console.log('Status:', matchProfissional.status);
            console.log('Data:', matchProfissional.data);
            console.log('Valor Serviço:', matchProfissional.servico?.preco);
            console.log('Profissional:', matchProfissional.profissionais[0].profissional.nome);
            console.log('Comissão Tipo:', matchProfissional.profissionais[0].profissional.comissaoTipo);
            console.log('Comissão Valor:', matchProfissional.profissionais[0].profissional.comissaoValor);
        } else {
            console.log('NENHUM agendamento com profissional vinculado encontrado!');
        }

    } catch (err) {
        console.error('ERRO NO PRISMA:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);
