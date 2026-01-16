import { Router } from 'express';
import * as clientesController from '../../controllers/clientesController';
import { autenticarDono } from '../../middleware/auth';

const router = Router();

// Aplicar autenticação do dono
router.use(autenticarDono);

router.get('/', clientesController.listarClientes);
router.post('/', clientesController.criarCliente);
// IMPORTANTE: Rotas com métodos HTTP diferentes devem vir antes de rotas genéricas
// Colocar DELETE e PUT antes de GET /:id para evitar conflitos
router.delete('/:id', clientesController.deletarCliente);
router.put('/:id', clientesController.atualizarCliente);
router.get('/:id', clientesController.buscarCliente);

export default router;
