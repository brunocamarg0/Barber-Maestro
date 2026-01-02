import { Router } from 'express';
import * as usuariosController from '../../controllers/usuariosController';

const router = Router();

// Criar usuário dono diretamente
router.post('/barbearias/:barbeariaId/dono', usuariosController.criarUsuarioDono);

// Buscar usuário dono
router.get('/barbearias/:barbeariaId/dono', usuariosController.buscarUsuarioDono);

// Atualizar usuário dono
router.put('/barbearias/:barbeariaId/dono', usuariosController.atualizarUsuarioDono);

// Deletar usuário dono
router.delete('/barbearias/:barbeariaId/dono', usuariosController.deletarUsuarioDono);

export default router;

