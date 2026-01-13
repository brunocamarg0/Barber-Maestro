import { Router } from 'express';
import * as clientesController from '../../controllers/clientesController';
import { autenticarDono } from '../../middleware/auth';

const router = Router();

// TODO: Reativar autenticação após implementar login do dono
// Por enquanto, desabilitar para testes
// router.use(autenticarDono);

// Middleware temporário para desenvolvimento (simula barbeariaId)
router.use((req: any, res: any, next: any) => {
  // Em desenvolvimento, usar barbeariaId padrão ou do localStorage
  req.barbeariaId = req.headers['x-barbearia-id'] || '1';
  next();
});

router.get('/', clientesController.listarClientes);
router.get('/:id', clientesController.buscarCliente);
router.post('/', clientesController.criarCliente);
router.put('/:id', clientesController.atualizarCliente);

export default router;
