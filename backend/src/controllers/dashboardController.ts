import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

/**
 * Obter KPIs do dashboard do dono
 */
export async function obterKPIs(req: AuthRequest, res: Response) {
  try {
    const { barbeariaId } = req;

    if (!barbeariaId) {
      return res.status(401).json({ error: 'Barbearia não identificada' });
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fimHoje = new Date(hoje);
    fimHoje.setHours(23, 59, 59, 999);

    // Ontem
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    const fimOntem = new Date(ontem);
    fimOntem.setHours(23, 59, 59, 999);

    // Semana atual (últimos 7 dias)
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(inicioSemana.getDate() - 7);
    
    // Semana passada
    const inicioSemanaPassada = new Date(inicioSemana);
    inicioSemanaPassada.setDate(inicioSemanaPassada.getDate() - 7);
    const fimSemanaPassada = new Date(inicioSemana);
    fimSemanaPassada.setDate(fimSemanaPassada.getDate() - 1);
    fimSemanaPassada.setHours(23, 59, 59, 999);

    // Mês atual
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59, 999);

    // Mês passado
    const inicioMesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const fimMesPassado = new Date(hoje.getFullYear(), hoje.getMonth(), 0, 23, 59, 59, 999);

    // Agendamentos de hoje
    const agendamentosHojeData = await prisma.agendamento.findMany({
      where: {
        barbeariaId,
        data: {
          gte: hoje,
          lte: fimHoje,
        },
        status: { in: ['pendente', 'confirmado', 'concluido'] },
      },
      include: {
        servico: true,
        pagamento: true,
      },
    });

    const agendamentosHoje = agendamentosHojeData.length;
    
    // Faturamento de hoje
    const faturamentoHoje = agendamentosHojeData.reduce((total, ag) => {
      if (ag.pagamento && ag.pagamento.status === 'pago') {
        return total + ag.pagamento.valor;
      }
      return total + (ag.servico?.preco || 0);
    }, 0);

    // Faturamento de ontem
    const agendamentosOntem = await prisma.agendamento.findMany({
      where: {
        barbeariaId,
        data: {
          gte: ontem,
          lte: fimOntem,
        },
        status: { in: ['confirmado', 'concluido'] },
      },
      include: {
        servico: true,
        pagamento: true,
      },
    });

    const faturamentoOntem = agendamentosOntem.reduce((total, ag) => {
      if (ag.pagamento && ag.pagamento.status === 'pago') {
        return total + ag.pagamento.valor;
      }
      return total + (ag.servico?.preco || 0);
    }, 0);

    // Faturamento da semana atual
    const agendamentosSemana = await prisma.agendamento.findMany({
      where: {
        barbeariaId,
        data: {
          gte: inicioSemana,
          lte: fimHoje,
        },
        status: { in: ['confirmado', 'concluido'] },
      },
      include: {
        servico: true,
        pagamento: true,
      },
    });

    const faturamentoSemana = agendamentosSemana.reduce((total, ag) => {
      if (ag.pagamento && ag.pagamento.status === 'pago') {
        return total + ag.pagamento.valor;
      }
      return total + (ag.servico?.preco || 0);
    }, 0);

    // Faturamento da semana passada
    const agendamentosSemanaPassada = await prisma.agendamento.findMany({
      where: {
        barbeariaId,
        data: {
          gte: inicioSemanaPassada,
          lte: fimSemanaPassada,
        },
        status: { in: ['confirmado', 'concluido'] },
      },
      include: {
        servico: true,
        pagamento: true,
      },
    });

    const faturamentoSemanaPassada = agendamentosSemanaPassada.reduce((total, ag) => {
      if (ag.pagamento && ag.pagamento.status === 'pago') {
        return total + ag.pagamento.valor;
      }
      return total + (ag.servico?.preco || 0);
    }, 0);

    // Agendamentos pendentes
    const agendamentosPendentes = await prisma.agendamento.count({
      where: {
        barbeariaId,
        status: 'pendente',
      },
    });

    // Faturamento do mês atual
    const agendamentosMes = await prisma.agendamento.findMany({
      where: {
        barbeariaId,
        data: {
          gte: inicioMes,
          lte: fimMes,
        },
        status: { in: ['confirmado', 'concluido'] },
      },
      include: {
        servico: true,
        pagamento: true,
      },
    });

    const faturamentoMes = agendamentosMes.reduce((total, ag) => {
      if (ag.pagamento && ag.pagamento.status === 'pago') {
        return total + ag.pagamento.valor;
      }
      return total + (ag.servico?.preco || 0);
    }, 0);

    // Faturamento do mês passado
    const agendamentosMesPassado = await prisma.agendamento.findMany({
      where: {
        barbeariaId,
        data: {
          gte: inicioMesPassado,
          lte: fimMesPassado,
        },
        status: { in: ['confirmado', 'concluido'] },
      },
      include: {
        servico: true,
        pagamento: true,
      },
    });

    const faturamentoMesPassado = agendamentosMesPassado.reduce((total, ag) => {
      if (ag.pagamento && ag.pagamento.status === 'pago') {
        return total + ag.pagamento.valor;
      }
      return total + (ag.servico?.preco || 0);
    }, 0);

    // Cancelamentos do mês
    const cancelamentos = await prisma.agendamento.count({
      where: {
        barbeariaId,
        data: {
          gte: inicioMes,
          lte: fimMes,
        },
        status: 'cancelado',
      },
    });

    // Total de clientes (últimos 30 dias)
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    
    const agendamentos30Dias = await prisma.agendamento.findMany({
      where: {
        barbeariaId,
        data: {
          gte: trintaDiasAtras,
        },
      },
      select: { clienteId: true },
      distinct: ['clienteId'],
    });
    const clientesRecorrentes = agendamentos30Dias.filter((a) => a.clienteId !== null).length;

    // Total de profissionais
    const totalProfissionais = await prisma.profissional.count({
      where: {
        barbeariaId,
        ativo: true,
      },
    });

    // Agendamentos do mês
    const totalAgendamentosMes = agendamentosMes.length;

    // Taxa de confirmação (últimos 30 dias)
    const confirmados = agendamentos30Dias.length > 0 
      ? await prisma.agendamento.count({
          where: {
            barbeariaId,
            data: {
              gte: trintaDiasAtras,
            },
            status: { in: ['confirmado', 'concluido'] },
          },
        })
      : 0;
    const totalAgendamentos30Dias = await prisma.agendamento.count({
      where: {
        barbeariaId,
        data: {
          gte: trintaDiasAtras,
        },
      },
    });
    const taxaConfirmacao = totalAgendamentos30Dias > 0 ? (confirmados / totalAgendamentos30Dias) * 100 : 0;

    // Nota média das avaliações
    const avaliacoes = await prisma.avaliacao.findMany({
      where: {
        agendamento: {
          barbeariaId,
        },
      },
      select: {
        notaProfissional: true,
        notaAtendimento: true,
        notaAmbiente: true,
      },
    });

    let notaMedia = 0;
    if (avaliacoes.length > 0) {
      const somaNotas = avaliacoes.reduce((total, av) => {
        const mediaAvaliacao = (av.notaProfissional + av.notaAtendimento + av.notaAmbiente) / 3;
        return total + mediaAvaliacao;
      }, 0);
      notaMedia = somaNotas / avaliacoes.length;
    }

    // Calcular variações percentuais
    const variacaoHoje = faturamentoOntem > 0 
      ? ((faturamentoHoje - faturamentoOntem) / faturamentoOntem) * 100 
      : 0;
    
    const variacaoSemana = faturamentoSemanaPassada > 0 
      ? ((faturamentoSemana - faturamentoSemanaPassada) / faturamentoSemanaPassada) * 100 
      : 0;
    
    const variacaoMes = faturamentoMesPassado > 0 
      ? ((faturamentoMes - faturamentoMesPassado) / faturamentoMesPassado) * 100 
      : 0;

    res.json({
      agendamentosHoje,
      agendamentosPendentes,
      faturamentoHoje: parseFloat(faturamentoHoje.toFixed(2)),
      faturamentoSemana: parseFloat(faturamentoSemana.toFixed(2)),
      faturamentoMes: parseFloat(faturamentoMes.toFixed(2)),
      cancelamentos,
      clientesRecorrentes,
      notaMedia: parseFloat(notaMedia.toFixed(1)),
      totalAvaliacoes: avaliacoes.length,
      variacaoHoje: parseFloat(variacaoHoje.toFixed(1)),
      variacaoSemana: parseFloat(variacaoSemana.toFixed(1)),
      variacaoMes: parseFloat(variacaoMes.toFixed(1)),
      totalClientes: clientesRecorrentes,
      totalProfissionais,
      totalAgendamentosMes,
      taxaConfirmacao: parseFloat(taxaConfirmacao.toFixed(2)),
    });
  } catch (error) {
    console.error('Erro ao obter KPIs:', error);
    res.status(500).json({ error: 'Erro ao obter KPIs' });
  }
}
