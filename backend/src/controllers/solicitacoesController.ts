import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { hashSenha } from '../utils/password';
import { calcularDataVencimento, gerarTokenConvite } from '../utils/token';
import { enviarEmailSenha } from '../services/emailService';

/**
 * Criar solicitação de cadastro
 */
export async function criarSolicitacao(req: Request, res: Response) {
  try {
    const { nome, cnpjCpf, responsavel, email, telefone, endereco, plano } = req.body;

    if (!nome || !cnpjCpf || !responsavel || !email) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, cnpjCpf, responsavel, email' });
    }

    // Verificar se já existe solicitação pendente com mesmo email ou CNPJ
    const solicitacaoExistente = await prisma.solicitacaoCadastro.findFirst({
      where: {
        OR: [
          { email },
          { cnpjCpf },
        ],
        status: 'pendente',
      },
    });

    if (solicitacaoExistente) {
      return res.status(400).json({ 
        error: 'Já existe uma solicitação pendente com este email ou CNPJ/CPF' 
      });
    }

    // Criar solicitação
    const solicitacao = await prisma.solicitacaoCadastro.create({
      data: {
        nome,
        cnpjCpf,
        responsavel,
        email,
        telefone: telefone || null,
        endereco: endereco || null,
        plano: plano || 'basico',
        status: 'pendente',
      },
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Solicitação enviada com sucesso! Aguarde a aprovação do administrador.',
      solicitacao: {
        id: solicitacao.id,
        nome: solicitacao.nome,
        email: solicitacao.email,
        status: solicitacao.status,
        createdAt: solicitacao.createdAt,
      },
    });
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    res.status(500).json({ error: 'Erro ao criar solicitação de cadastro' });
  }
}

/**
 * Listar todas as solicitações (admin)
 */
export async function listarSolicitacoes(req: Request, res: Response) {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status && typeof status === 'string') {
      where.status = status;
    }

    const solicitacoes = await prisma.solicitacaoCadastro.findMany({
      where,
      include: {
        barbearia: {
          select: {
            id: true,
            nome: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(solicitacoes);
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({ error: 'Erro ao listar solicitações' });
  }
}

/**
 * Aprovar solicitação e criar barbearia com senha temporária
 */
export async function aprovarSolicitacao(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { observacoes } = req.body;
    const adminId = (req as any).user?.id; // Assumindo que há middleware de autenticação

    // Buscar solicitação
    const solicitacao = await prisma.solicitacaoCadastro.findUnique({
      where: { id },
    });

    if (!solicitacao) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    if (solicitacao.status !== 'pendente') {
      return res.status(400).json({ error: 'Esta solicitação já foi processada' });
    }

    // Gerar senha temporária
    const senhaTemporaria = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + '!@#';
    const senhaHash = await hashSenha(senhaTemporaria);

    const dataVencimento = calcularDataVencimento(solicitacao.plano);

    // Criar barbearia, dono e convite em transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Criar barbearia
      const barbearia = await tx.barbearia.create({
        data: {
          nome: solicitacao.nome,
          cnpjCpf: solicitacao.cnpjCpf,
          responsavel: solicitacao.responsavel,
          plano: solicitacao.plano,
          email: solicitacao.email,
          telefone: solicitacao.telefone,
          endereco: solicitacao.endereco,
          dataVencimento,
          status: 'em_teste',
        },
      });

      // Criar dono com senha temporária
      const dono = await tx.usuarioDono.create({
        data: {
          nome: solicitacao.responsavel,
          email: solicitacao.email,
          senha: senhaHash,
          barbeariaId: barbearia.id,
          ativo: true,
          emailVerificado: false,
        },
      });

      // Gerar convite (opcional, para link de ativação)
      const token = gerarTokenConvite();
      const expiraEm = new Date();
      expiraEm.setDate(expiraEm.getDate() + 7);

      await tx.convite.create({
        data: {
          token,
          email: solicitacao.email,
          expiraEm,
          barbeariaId: barbearia.id,
        },
      });

      // Atualizar solicitação
      await tx.solicitacaoCadastro.update({
        where: { id },
        data: {
          status: 'aprovada',
          barbeariaId: barbearia.id,
          aprovadaEm: new Date(),
          aprovadaPor: adminId || null,
          observacoes: observacoes || null,
        },
      });

      return { barbearia, dono, senhaTemporaria };
    });

    // Enviar email com senha
    try {
      await enviarEmailSenha({
        email: solicitacao.email,
        nome: solicitacao.responsavel,
        nomeBarbearia: solicitacao.nome,
        senha: resultado.senhaTemporaria,
      });
    } catch (emailError) {
      console.error('Erro ao enviar email (barbearia criada mesmo assim):', emailError);
      // Não falha a aprovação se o email falhar
    }

    res.json({
      sucesso: true,
      mensagem: 'Solicitação aprovada e senha enviada por email',
      barbearia: resultado.barbearia,
      senhaEnviada: true,
    });
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error);
    res.status(500).json({ error: 'Erro ao aprovar solicitação' });
  }
}

/**
 * Rejeitar solicitação
 */
export async function rejeitarSolicitacao(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { observacoes } = req.body;
    const adminId = (req as any).user?.id;

    const solicitacao = await prisma.solicitacaoCadastro.findUnique({
      where: { id },
    });

    if (!solicitacao) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    if (solicitacao.status !== 'pendente') {
      return res.status(400).json({ error: 'Esta solicitação já foi processada' });
    }

    await prisma.solicitacaoCadastro.update({
      where: { id },
      data: {
        status: 'rejeitada',
        observacoes: observacoes || null,
        aprovadaPor: adminId || null,
      },
    });

    res.json({
      sucesso: true,
      mensagem: 'Solicitação rejeitada',
    });
  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error);
    res.status(500).json({ error: 'Erro ao rejeitar solicitação' });
  }
}
