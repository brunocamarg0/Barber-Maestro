import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Listar clientes de uma barbearia
 */
export async function listarClientes(req: Request, res: Response) {
  try {
    const { barbeariaId } = req.params;

    // TODO: Verificar se o usuário autenticado é dono desta barbearia
    // Por enquanto, assumimos que barbeariaId vem nos params

    const clientes = await prisma.cliente.findMany({
      where: {
        // Buscar clientes que têm agendamentos nesta barbearia
        agendamentos: {
          some: {
            servico: {
              barbeariaId,
            },
          },
        },
      },
      include: {
        agendamentos: {
          where: {
            servico: {
              barbeariaId,
            },
          },
          include: {
            servico: true,
            pagamentos: true,
          },
        },
        clienteVIP: {
          where: {
            barbeariaId,
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });

    // Transformar dados para o formato esperado pelo frontend
    const clientesFormatados = clientes.map((cliente) => {
      const agendamentosBarbearia = cliente.agendamentos || [];
      const totalAgendamentos = agendamentosBarbearia.length;
      
      // Calcular ticket médio baseado nos pagamentos dos agendamentos
      const ticketMedio =
        totalAgendamentos > 0
          ? agendamentosBarbearia.reduce((sum, a) => {
              // Buscar pagamentos do agendamento
              const pagamentosPagos = a.pagamentos?.filter(p => p.status === 'pago') || [];
              const valorPago = pagamentosPagos.reduce((s, p) => s + p.valor, 0);
              return sum + valorPago;
            }, 0) / totalAgendamentos
          : 0;

      // Ordenar agendamentos por data para pegar o último
      const agendamentosOrdenados = [...agendamentosBarbearia].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );

      return {
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone || '',
        email: cliente.email,
        vip: cliente.clienteVIP && cliente.clienteVIP.length > 0,
        totalAgendamentos,
        ultimoAgendamento:
          agendamentosOrdenados.length > 0
            ? agendamentosOrdenados[0].data.toISOString().split('T')[0]
            : null,
        ticketMedio,
        frequencia: 0, // TODO: Calcular frequência mensal
        dataCadastro: cliente.createdAt.toISOString().split('T')[0],
      };
    });

    res.json({
      sucesso: true,
      clientes: clientesFormatados,
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
}

/**
 * Criar cliente
 */
export async function criarCliente(req: Request, res: Response) {
  try {
    const { barbeariaId } = req.params;
    const { nome, telefone, email } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, telefone' });
    }

    // Verificar se telefone já está em uso
    const clienteExistentePorTelefone = await prisma.cliente.findFirst({
      where: {
        telefone,
      },
    });

    if (clienteExistentePorTelefone) {
      return res.status(400).json({ error: 'Este telefone já está cadastrado' });
    }

    // Verificar se email já está em uso (se fornecido)
    if (email) {
      const clienteExistentePorEmail = await prisma.cliente.findUnique({
        where: {
          email,
        },
      });

      if (clienteExistentePorEmail) {
        return res.status(400).json({ error: 'Este email já está cadastrado' });
      }
    }

    // Gerar email temporário se não fornecido (email é obrigatório no schema)
    const emailFinal = email || `temp_${Date.now()}@temp.com`;

    // Criar cliente
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        email: emailFinal,
        ativo: true,
        emailVerificado: false,
      },
      select: {
        id: true,
        nome: true,
        telefone: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Cliente criado com sucesso!',
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone || '',
        email: cliente.email,
        vip: false,
        totalAgendamentos: 0,
        ultimoAgendamento: null,
        ticketMedio: 0,
        frequencia: 0,
        dataCadastro: cliente.createdAt.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
}

/**
 * Marcar cliente como VIP
 */
export async function marcarClienteVIP(req: Request, res: Response) {
  try {
    const { barbeariaId, clienteId } = req.params;
    const { vip } = req.body;

    if (vip) {
      // Criar ou verificar se já existe
      await prisma.clienteVIP.upsert({
        where: {
          clienteId,
        },
        create: {
          clienteId,
          barbeariaId,
        },
        update: {},
      });
    } else {
      // Remover VIP
      await prisma.clienteVIP.deleteMany({
        where: {
          clienteId,
          barbeariaId,
        },
      });
    }

    res.json({
      sucesso: true,
      mensagem: vip ? 'Cliente marcado como VIP' : 'VIP removido',
    });
  } catch (error) {
    console.error('Erro ao marcar cliente VIP:', error);
    res.status(500).json({ error: 'Erro ao marcar cliente VIP' });
  }
}
