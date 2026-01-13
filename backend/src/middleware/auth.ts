import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export interface AuthRequest extends Request {
  userId?: string;
  userType?: 'dono' | 'admin' | 'cliente';
  barbeariaId?: string;
}

/**
 * Middleware para autenticar usuário dono
 */
export async function autenticarDono(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('🔐 autenticarDono: Iniciando autenticação...');
    console.log('🔐 autenticarDono: Path:', req.path);
    console.log('🔐 autenticarDono: Method:', req.method);
    
    const authHeader = req.headers.authorization;
    console.log('🔐 autenticarDono: Authorization header presente:', !!authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.error('❌ autenticarDono: Token não fornecido');
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    console.log('🔐 autenticarDono: Token presente, verificando...');
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    console.log('🔐 autenticarDono: JWT_SECRET configurado:', !!process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token, jwtSecret) as any;
    console.log('🔐 autenticarDono: Token decodificado:', { id: decoded.id, email: decoded.email, tipo: decoded.tipo });
    
    // O token contém { id, email, tipo }
    const userId = decoded.id || decoded.userId;
    
    if (!userId) {
      console.error('❌ autenticarDono: ID do usuário não encontrado no token');
      return res.status(401).json({ error: 'Token inválido: ID do usuário não encontrado' });
    }
    
    console.log('🔐 autenticarDono: Buscando dono no banco com ID:', userId);
    // Buscar usuário dono
    const dono = await prisma.usuarioDono.findUnique({
      where: { id: userId },
      include: { barbearia: true },
    });

    if (!dono) {
      console.error('❌ autenticarDono: Dono não encontrado no banco');
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!dono.ativo) {
      console.error('❌ autenticarDono: Dono inativo');
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    console.log('✅ autenticarDono: Autenticação bem-sucedida para:', dono.email);
    req.userId = dono.id;
    req.userType = 'dono';
    req.barbeariaId = dono.barbeariaId;
    
    next();
  } catch (error: any) {
    console.error('❌ Erro na autenticação:', error);
    console.error('❌ Erro tipo:', error.name);
    console.error('❌ Erro mensagem:', error.message);
    console.error('❌ Erro stack:', error.stack);
    
    // Mensagens de erro mais específicas
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido: formato incorreto' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Faça login novamente.' });
    }
    
    return res.status(401).json({ error: 'Token inválido' });
  }
}
