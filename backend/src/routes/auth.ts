import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// Rotas de cliente
router.post('/cliente/registro', authController.registrarCliente);
router.post('/cliente/login', authController.loginCliente);

// Rotas de dono
router.post('/dono/registro', authController.registrarDono);
router.post('/dono/login', authController.loginDono);

// Rotas de admin
router.post('/admin/login', authController.loginAdmin);

export default router;

