import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';
import { hashSenha } from '../../utils/password';
import { calcularDataVencimento } from '../../utils/token';

const router = Router();

/**
 * Endpoint temporário para criar usuário exemplo
 * GET ou POST /api/admin/criar-exemplo
 */
router.get('/criar-exemplo', async (req: Request, res: Response) => {
  // Mesma lógica do POST
  await criarUsuarioExemplo(req, res);
});

router.post('/criar-exemplo', async (req: Request, res: Response) => {
  await criarUsuarioExemplo(req, res);
});

async function criarUsuarioExemplo(req: Request, res: Response) {
  try {
    const email = 'wesley.teste@hotmail.com';
    const senha = 'teste 123';
    const nome = 'Wesley';

    // Verificar se o email já existe
    const usuarioExistente = await prisma.usuarioDono.findUnique({
      where: { email },
      include: { barbearia: true },
    });

    if (usuarioExistente) {
      return res.json({
        sucesso: true,
        mensagem: 'Usuário já existe!',
        usuario: {
          id: usuarioExistente.id,
          nome: usuarioExistente.nome,
          email: usuarioExistente.email,
          barbeariaId: usuarioExistente.barbeariaId,
        },
        barbearia: usuarioExistente.barbearia,
      });
    }

    // Hash da senha
    const senhaHash = await hashSenha(senha);

    // Criar barbearia primeiro
    const dataVencimento = calcularDataVencimento('premium');

    const barbearia = await prisma.barbearia.create({
      data: {
        nome: 'Barbearia do Wesley',
        cnpjCpf: '12345678000190',
        responsavel: 'Wesley',
        plano: 'premium',
        status: 'ativa',
        dataCriacao: new Date(),
        dataVencimento: dataVencimento,
        email: email,
        telefone: '(11) 99999-9999',
        endereco: 'Rua Exemplo, 123 - São Paulo, SP',
      },
    });

    // Criar usuário dono
    const dono = await prisma.usuarioDono.create({
      data: {
        nome: nome,
        email: email,
        senha: senhaHash,
        barbeariaId: barbearia.id,
        ativo: true,
        emailVerificado: true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        barbeariaId: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário exemplo criado com sucesso!',
      usuario: dono,
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome,
        plano: barbearia.plano,
        status: barbearia.status,
      },
      credenciais: {
        email: email,
        senha: senha,
      },
    });
  } catch (error) {
    console.error('Erro ao criar usuário exemplo:', error);
    res.status(500).json({ 
      error: 'Erro ao criar usuário exemplo',
      detalhes: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

export default router;
