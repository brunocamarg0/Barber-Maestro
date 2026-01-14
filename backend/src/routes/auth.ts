import { Router } from 'express';
import * as authController from '../controllers/authController';
import { autenticarDono } from '../middleware/auth';

const router = Router();

// Log para debug - verificar se o router está sendo criado
console.log('🔧 Router de autenticação criado');

// Rotas de cliente
router.post('/cliente/registro', authController.registrarCliente);
router.post('/cliente/login', authController.loginCliente);
router.post('/cliente/esqueci-senha', (req, res, next) => {
  console.log('🔧 [AUTH ROUTER] Rota POST /cliente/esqueci-senha chamada');
  console.log('🔧 [AUTH ROUTER] Body:', req.body);
  console.log('🔧 [AUTH ROUTER] Path:', req.path);
  next();
}, authController.esqueciMinhaSenhaCliente);

// Rotas de dono
router.post('/dono/cadastro-direto', authController.cadastroDiretoDono);
router.post('/dono/registro', authController.registrarDono);
router.post('/dono/login', authController.loginDono);
router.post('/dono/esqueci-senha', (req, res, next) => {
  console.log('🔧 [AUTH ROUTER] Rota POST /dono/esqueci-senha chamada');
  console.log('🔧 [AUTH ROUTER] Body:', req.body);
  console.log('🔧 [AUTH ROUTER] Path:', req.path);
  next();
}, authController.esqueciMinhaSenhaDono);

// Rota protegida - requer autenticação
// IMPORTANTE: A ordem importa! Rotas mais específicas primeiro
console.log('🔧 Registrando rota PUT /dono/alterar-senha');
router.put('/dono/alterar-senha', (req, res, next) => {
  console.log('🔐 Middleware de alterar-senha: Rota chamada');
  console.log('🔐 Method:', req.method);
  console.log('🔐 Path:', req.path);
  next();
}, autenticarDono, authController.alterarSenhaDono);

// Rotas de admin
router.post('/admin/login', authController.loginAdmin);

export default router;

