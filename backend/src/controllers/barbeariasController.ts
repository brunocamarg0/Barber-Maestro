import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { calcularDataVencimento, gerarTokenConvite } from '../utils/token';
import { enviarEmailConvite } from '../services/emailService';

/**
 * Listar todas as barbearias
 */
export async function listarBarbearias(req: Request, res: Response) {
  try {
    // Usar `select` para evitar quebrar caso o banco esteja temporariamente sem colunas novas
    // (ex: foto/latitude/longitude/assinatura) durante migrações em produção.
    const barbearias = await prisma.barbearia.findMany({
      select: {
        id: true,
        nome: true,
        cnpjCpf: true,
        responsavel: true,
        plano: true,
        status: true,
        email: true,
        telefone: true,
        endereco: true,
        cidade: true,
        bairro: true,
        cep: true,
        dataVencimento: true,
        createdAt: true,
        updatedAt: true,
        dono: {
          select: {
            id: true,
            nome: true,
            email: true,
            ativo: true,
          },
        },
        convites: {
          where: {
            usado: false,
            expiraEm: {
              gt: new Date(),
            },
          },
          select: {
            id: true,
            token: true,
            expiraEm: true,
          },
        },
        _count: {
          select: {
            servicos: true,
            agendamentos: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(barbearias);
  } catch (error: any) {
    console.error('❌ [ADMIN BARBEARIAS] Erro ao listar barbearias:', error);
    console.error('❌ [ADMIN BARBEARIAS] Stack:', error?.stack);
    console.error('❌ [ADMIN BARBEARIAS] Message:', error?.message);
    console.error('❌ [ADMIN BARBEARIAS] Code:', error?.code);
    console.error('❌ [ADMIN BARBEARIAS] Meta:', error?.meta);

    const errorMessage = process.env.NODE_ENV === 'development'
      ? `Erro ao listar barbearias: ${error?.message || 'Erro desconhecido'}`
      : 'Erro ao listar barbearias';

    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
}

/**
 * Buscar barbearia por ID
 */
export async function buscarBarbearia(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const barbearia = await prisma.barbearia.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        cnpjCpf: true,
        responsavel: true,
        plano: true,
        status: true,
        email: true,
        telefone: true,
        endereco: true,
        cidade: true,
        bairro: true,
        cep: true,
        dataVencimento: true,
        createdAt: true,
        updatedAt: true,
        dono: {
          select: {
            id: true,
            nome: true,
            email: true,
            ativo: true,
            emailVerificado: true,
          },
        },
        servicos: {
          orderBy: {
            ordem: 'asc',
          },
        },
        convites: {
          where: {
            usado: false,
            expiraEm: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (!barbearia) {
      return res.status(404).json({ error: 'Barbearia não encontrada' });
    }

    res.json(barbearia);
  } catch (error: any) {
    console.error('❌ [ADMIN BARBEARIAS] Erro ao buscar barbearia:', error);
    console.error('❌ [ADMIN BARBEARIAS] Stack:', error?.stack);
    console.error('❌ [ADMIN BARBEARIAS] Message:', error?.message);
    console.error('❌ [ADMIN BARBEARIAS] Code:', error?.code);
    console.error('❌ [ADMIN BARBEARIAS] Meta:', error?.meta);

    const errorMessage = process.env.NODE_ENV === 'development'
      ? `Erro ao buscar barbearia: ${error?.message || 'Erro desconhecido'}`
      : 'Erro ao buscar barbearia';

    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
}

/**
 * Criar nova barbearia (sem dono ainda) e gerar convite automaticamente
 */
export async function criarBarbearia(req: Request, res: Response) {
  try {
    const { nome, cnpjCpf, responsavel, plano, email, telefone, endereco, cidade, bairro, cep, enviarEmail = true } = req.body;

    // Validações básicas
    if (!nome || !cnpjCpf || !responsavel || !plano) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, cnpjCpf, responsavel, plano' });
    }

    const dataVencimento = calcularDataVencimento(plano);

    // Criar barbearia e convite em uma transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Criar barbearia
      const barbearia = await tx.barbearia.create({
        data: {
          nome,
          cnpjCpf,
          responsavel,
          plano,
          email,
          telefone,
          endereco,
          cidade,
          bairro,
          cep,
          dataVencimento,
          status: 'em_teste',
        },
      });

      // Gerar convite automaticamente
      const token = gerarTokenConvite();
      const expiraEm = new Date();
      expiraEm.setDate(expiraEm.getDate() + 7); // 7 dias de validade

      const convite = await tx.convite.create({
        data: {
          token,
          email: email || null, // Email da barbearia se fornecido
          expiraEm,
          barbeariaId: barbearia.id,
        },
      });

      return { barbearia, convite };
    });

    // Enviar email se solicitado e se tiver email
    let emailEnviado = false;
    let emailInfo = null;

    if (enviarEmail && email) {
      try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const linkAtivacao = `${frontendUrl}/ativar-conta?token=${resultado.convite.token}`;

        emailInfo = await enviarEmailConvite({
          email,
          nomeBarbearia: nome,
          nomeResponsavel: responsavel,
          linkAtivacao,
          expiraEm: resultado.convite.expiraEm,
        });

        emailEnviado = true;
      } catch (emailError) {
        console.error('Erro ao enviar email (barbearia criada mesmo assim):', emailError);
        // Não falha a criação se o email falhar
      }
    }

    res.status(201).json({
      ...resultado.barbearia,
      convite: {
        id: resultado.convite.id,
        token: resultado.convite.token,
        expiraEm: resultado.convite.expiraEm,
        linkAtivacao: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ativar-conta?token=${resultado.convite.token}`,
      },
      emailEnviado,
      emailInfo,
    });
  } catch (error) {
    console.error('Erro ao criar barbearia:', error);
    res.status(500).json({ error: 'Erro ao criar barbearia' });
  }
}

/**
 * Atualizar barbearia
 */
export async function atualizarBarbearia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, cnpjCpf, responsavel, plano, email, telefone, endereco, status } = req.body;

    const barbearia = await prisma.barbearia.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(cnpjCpf && { cnpjCpf }),
        ...(responsavel && { responsavel }),
        ...(plano && { plano }),
        ...(email !== undefined && { email }),
        ...(telefone !== undefined && { telefone }),
        ...(endereco !== undefined && { endereco }),
        ...(status && { status }),
      },
    });

    res.json(barbearia);
  } catch (error) {
    console.error('Erro ao atualizar barbearia:', error);
    res.status(500).json({ error: 'Erro ao atualizar barbearia' });
  }
}

/**
 * Alterar status da barbearia
 */
export async function alterarStatusBarbearia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['ativa', 'em_teste', 'bloqueada', 'cancelada'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const barbearia = await prisma.barbearia.update({
      where: { id },
      data: { status },
    });

    res.json(barbearia);
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    res.status(500).json({ error: 'Erro ao alterar status' });
  }
}

/**
 * Deletar barbearia
 */
export async function deletarBarbearia(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.barbearia.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar barbearia:', error);
    res.status(500).json({ error: 'Erro ao deletar barbearia' });
  }
}

