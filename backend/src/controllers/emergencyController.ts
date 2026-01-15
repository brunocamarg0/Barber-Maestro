import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { hashSenha } from '../utils/password';

/**
 * ROTA DE EMERGÊNCIA: Resetar senha diretamente sem email
 * ⚠️ ATENÇÃO: Esta rota deve ser removida após resolver o problema de email
 * 
 * Uso: POST /api/emergency/reset-password
 * Body: { email: 'seu-email@exemplo.com', novaSenha: 'SenhaNova123', tipo: 'dono' | 'cliente' }
 */
export async function resetarSenhaEmergencia(req: Request, res: Response) {
  try {
    const { email, novaSenha, tipo } = req.body;

    console.log('🚨 [EMERGENCY] Reset de senha solicitado');
    console.log('🚨 [EMERGENCY] Email:', email);
    console.log('🚨 [EMERGENCY] Tipo:', tipo);

    if (!email || !novaSenha || !tipo) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: email, novaSenha, tipo (dono ou cliente)' 
      });
    }

    if (tipo !== 'dono' && tipo !== 'cliente') {
      return res.status(400).json({ 
        error: 'Tipo deve ser "dono" ou "cliente"' 
      });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ 
        error: 'A senha deve ter pelo menos 6 caracteres' 
      });
    }

    // Hash da nova senha
    const senhaHash = await hashSenha(novaSenha);

    if (tipo === 'dono') {
      // Buscar dono
      const dono = await prisma.usuarioDono.findUnique({
        where: { email },
      });

      if (!dono) {
        return res.status(404).json({ 
          error: 'Email não encontrado para dono' 
        });
      }

      // Atualizar senha
      await prisma.usuarioDono.update({
        where: { id: dono.id },
        data: { senha: senhaHash },
      });

      console.log('✅ [EMERGENCY] Senha resetada para dono:', email);
      console.log('✅ [EMERGENCY] Nova senha:', novaSenha);

      return res.json({
        sucesso: true,
        mensagem: 'Senha resetada com sucesso!',
        email: email,
        tipo: 'dono',
        novaSenha: novaSenha, // ⚠️ Retornar senha apenas em emergência
      });
    } else {
      // Buscar cliente
      const cliente = await prisma.cliente.findUnique({
        where: { email },
      });

      if (!cliente) {
        return res.status(404).json({ 
          error: 'Email não encontrado para cliente' 
        });
      }

      // Atualizar senha
      await prisma.cliente.update({
        where: { id: cliente.id },
        data: { senha: senhaHash },
      });

      console.log('✅ [EMERGENCY] Senha resetada para cliente:', email);
      console.log('✅ [EMERGENCY] Nova senha:', novaSenha);

      return res.json({
        sucesso: true,
        mensagem: 'Senha resetada com sucesso!',
        email: email,
        tipo: 'cliente',
        novaSenha: novaSenha, // ⚠️ Retornar senha apenas em emergência
      });
    }
  } catch (error: any) {
    console.error('❌ [EMERGENCY] Erro ao resetar senha:', error);
    return res.status(500).json({ 
      error: 'Erro ao resetar senha',
      detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

