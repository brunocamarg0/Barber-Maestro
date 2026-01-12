import { Router } from 'express';
import * as solicitacoesController from '../controllers/solicitacoesController';

const router = Router();

// Rota pública para criar solicitação
router.post('/', solicitacoesController.criarSolicitacao);

// Rotas admin (proteger com middleware de autenticação admin)
router.get('/admin', solicitacoesController.listarSolicitacoes);
router.post('/admin/:id/aprovar', solicitacoesController.aprovarSolicitacao);
router.post('/admin/:id/rejeitar', solicitacoesController.rejeitarSolicitacao);

export default router;
