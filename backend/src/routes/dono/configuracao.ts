import { Router } from 'express';
import { autenticarDono } from '../../middleware/auth';
import prisma from '../../lib/prisma';
import { AuthRequest } from '../../middleware/auth';

const router = Router();

// Aplicar autenticação do dono
router.use(autenticarDono);

/**
 * GET /api/dono/configuracao
 * Buscar configuração da barbearia
 */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { barbeariaId } = req;

    if (!barbeariaId) {
      return res.status(401).json({ error: 'Barbearia não identificada' });
    }

    const barbearia = await prisma.barbearia.findUnique({
      where: { id: barbeariaId },
      select: {
        id: true,
        nome: true,
        cnpjCpf: true,
        email: true,
        telefone: true,
        endereco: true,
        cidade: true,
        bairro: true,
        cep: true,
        modoConfirmacao: true,
        horarioFuncionamento: true,
        politicaCancelamento: true,
        linkAgendamento: true,
        paginaPublica: true,
      },
    });

    if (!barbearia) {
      return res.status(404).json({ error: 'Barbearia não encontrada' });
    }

    res.json(barbearia);
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    res.status(500).json({ error: 'Erro ao buscar configuração' });
  }
});

/**
 * PUT /api/dono/configuracao
 * Atualizar configuração da barbearia
 */
router.put('/', async (req: AuthRequest, res) => {
  try {
    const { barbeariaId } = req;
    const dados = req.body;

    if (!barbeariaId) {
      return res.status(401).json({ error: 'Barbearia não identificada' });
    }

    const barbearia = await prisma.barbearia.update({
      where: { id: barbeariaId },
      data: {
        ...(dados.nome && { nome: dados.nome }),
        ...(dados.cnpjCpf !== undefined && { cnpjCpf: dados.cnpjCpf }),
        ...(dados.email !== undefined && { email: dados.email }),
        ...(dados.telefone !== undefined && { telefone: dados.telefone }),
        ...(dados.endereco !== undefined && { endereco: dados.endereco }),
        ...(dados.cidade !== undefined && { cidade: dados.cidade }),
        ...(dados.bairro !== undefined && { bairro: dados.bairro }),
        ...(dados.cep !== undefined && { cep: dados.cep }),
        ...(dados.modoConfirmacao !== undefined && { modoConfirmacao: dados.modoConfirmacao }),
        ...(dados.horarioFuncionamento !== undefined && { horarioFuncionamento: dados.horarioFuncionamento }),
        ...(dados.politicaCancelamento !== undefined && { politicaCancelamento: dados.politicaCancelamento }),
        ...(dados.linkAgendamento !== undefined && { linkAgendamento: dados.linkAgendamento }),
        ...(dados.paginaPublica !== undefined && { paginaPublica: dados.paginaPublica }),
      },
    });

    res.json(barbearia);
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
});

export default router;
