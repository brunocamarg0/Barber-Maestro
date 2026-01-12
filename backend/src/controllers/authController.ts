import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { hashSenha, compararSenha } from '../utils/password';
import { gerarTokenJWT } from '../utils/token';

/**
 * Registro de cliente
 */
export async function registrarCliente(req: Request, res: Response) {
  try {
    const { nome, email, senha, telefone, dataNascimento } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha' });
    }

    // Verificar se email já está em uso
    const emailExistente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (emailExistente) {
      return res.status(400).json({ error: 'Este email já está em uso' });
    }

    // Hash da senha
    const senhaHash = await hashSenha(senha);

    // Criar cliente
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone: telefone || null,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        ativo: true,
        emailVerificado: false,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        dataNascimento: true,
        createdAt: true,
      },
    });

    // Gerar token JWT
    const token = gerarTokenJWT({
      id: cliente.id,
      email: cliente.email,
      tipo: 'cliente',
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Conta criada com sucesso!',
      token,
      usuario: cliente,
    });
  } catch (error) {
    console.error('Erro ao registrar cliente:', error);
    res.status(500).json({ error: 'Erro ao registrar cliente' });
  }
}

/**
 * Login de cliente
 */
export async function loginCliente(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar cliente
    const cliente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (!cliente) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha (pode ser null se criado via OAuth)
    if (!cliente.senha) {
      return res.status(401).json({ error: 'Esta conta foi criada com Google. Use o login com Google.' });
    }

    const senhaValida = await compararSenha(senha, cliente.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar se conta está ativa
    if (!cliente.ativo) {
      return res.status(403).json({ error: 'Conta desativada. Entre em contato com o suporte.' });
    }

    // Gerar token JWT
    const token = gerarTokenJWT({
      id: cliente.id,
      email: cliente.email,
      tipo: 'cliente',
    });

    res.json({
      sucesso: true,
      token,
      usuario: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        dataNascimento: cliente.dataNascimento,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login do cliente:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

/**
 * Registro de dono (requer barbearia criada pelo admin)
 * Nota: Para criar conta de dono, o admin precisa criar a barbearia primeiro
 * e então o dono pode se registrar vinculando-se à barbearia
 */
export async function registrarDono(req: Request, res: Response) {
  try {
    const { nome, email, senha, barbeariaId } = req.body;

    if (!nome || !email || !senha || !barbeariaId) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha, barbeariaId' });
    }

    // Verificar se barbearia existe e não tem dono
    const barbearia = await prisma.barbearia.findUnique({
      where: { id: barbeariaId },
      include: { dono: true },
    });

    if (!barbearia) {
      return res.status(404).json({ error: 'Barbearia não encontrada' });
    }

    if (barbearia.dono) {
      return res.status(400).json({ error: 'Esta barbearia já possui um dono cadastrado' });
    }

    // Verificar se email já está em uso
    const emailExistente = await prisma.usuarioDono.findUnique({
      where: { email },
    });

    if (emailExistente) {
      return res.status(400).json({ error: 'Este email já está em uso' });
    }

    // Hash da senha
    const senhaHash = await hashSenha(senha);

    // Criar dono
    const dono = await prisma.usuarioDono.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        barbeariaId,
        ativo: true,
        emailVerificado: false,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        barbeariaId: true,
        createdAt: true,
      },
    });

    // Gerar token JWT
    const token = gerarTokenJWT({
      id: dono.id,
      email: dono.email,
      tipo: 'dono',
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Conta criada com sucesso!',
      token,
      usuario: dono,
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar dono:', error);
    res.status(500).json({ error: 'Erro ao registrar dono' });
  }
}

/**
 * Login de dono
 */
export async function loginDono(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar dono
    const dono = await prisma.usuarioDono.findUnique({
      where: { email },
      include: {
        barbearia: {
          select: {
            id: true,
            nome: true,
            status: true,
          },
        },
      },
    });

    if (!dono) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha (pode ser null se criado via OAuth)
    if (!dono.senha) {
      return res.status(401).json({ error: 'Esta conta foi criada com Google. Use o login com Google.' });
    }

    const senhaValida = await compararSenha(senha, dono.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar se conta está ativa
    if (!dono.ativo) {
      return res.status(403).json({ error: 'Conta desativada. Entre em contato com o suporte.' });
    }

    // Gerar token JWT
    const token = gerarTokenJWT({
      id: dono.id,
      email: dono.email,
      tipo: 'dono',
    });

    res.json({
      sucesso: true,
      token,
      usuario: {
        id: dono.id,
        nome: dono.nome,
        email: dono.email,
        barbeariaId: dono.barbeariaId,
      },
      barbearia: dono.barbearia,
    });
  } catch (error) {
    console.error('Erro ao fazer login do dono:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

/**
 * Login de admin
 */
export async function loginAdmin(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar admin
    const admin = await prisma.usuarioAdmin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const senhaValida = await compararSenha(senha, admin.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar se conta está ativa
    if (!admin.ativo) {
      return res.status(403).json({ error: 'Conta desativada. Entre em contato com o suporte.' });
    }

    // Gerar token JWT
    const token = gerarTokenJWT({
      id: admin.id,
      email: admin.email,
      tipo: 'admin',
    });

    res.json({
      sucesso: true,
      token,
      usuario: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login do admin:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

/**
 * Alterar senha do dono
 */
export async function alterarSenhaDono(req: Request, res: Response) {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const donoId = (req as any).user?.id; // Assumindo middleware de autenticação

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
    }

    // Buscar dono
    const dono = await prisma.usuarioDono.findUnique({
      where: { id: donoId },
    });

    if (!dono) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (!dono.senha) {
      return res.status(400).json({ error: 'Esta conta não possui senha cadastrada. Use o login com Google.' });
    }

    // Verificar senha atual
    const senhaValida = await compararSenha(senhaAtual, dono.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    // Hash da nova senha
    const novaSenhaHash = await hashSenha(novaSenha);

    // Atualizar senha
    await prisma.usuarioDono.update({
      where: { id: donoId },
      data: { senha: novaSenhaHash },
    });

    res.json({
      sucesso: true,
      mensagem: 'Senha alterada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
}

