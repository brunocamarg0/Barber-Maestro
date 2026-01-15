import { Router } from 'express';
import * as emergencyController from '../controllers/emergencyController';

const router = Router();

// ⚠️ ROTA DE EMERGÊNCIA - Remover após resolver problema de email
// POST /api/emergency/reset-password
// Body: { email: 'seu-email@exemplo.com', novaSenha: 'SenhaNova123', tipo: 'dono' | 'cliente' }
router.post('/reset-password', emergencyController.resetarSenhaEmergencia);

export default router;

