import { Router, Request, Response } from 'express';
import passport from 'passport';
import * as googleAuthController from '../controllers/googleAuthController';

const router = Router();

// Rotas de autenticação Google para Cliente
router.get(
  '/cliente',
  (req: Request, res: Response, next) => {
    // Salvar tipo na sessão
    (req.session as any).authType = 'cliente';
    next();
  },
  passport.authenticate('google-cliente', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/cliente/callback',
  passport.authenticate('google-cliente', { failureRedirect: '/login?error=google_auth_failed' }),
  googleAuthController.googleCallbackCliente
);

// Rotas de autenticação Google para Dono
router.get(
  '/dono',
  (req: Request, res: Response, next) => {
    // Salvar tipo e barbeariaId na sessão
    (req.session as any).authType = 'dono';
    (req.session as any).barbeariaId = req.query.barbeariaId;
    next();
  },
  passport.authenticate('google-dono', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/dono/callback',
  passport.authenticate('google-dono', { failureRedirect: '/login?error=google_auth_failed' }),
  googleAuthController.googleCallbackDono
);

export default router;
