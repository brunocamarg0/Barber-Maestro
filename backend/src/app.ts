import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import adminBarbeariasRoutes from './routes/admin/barbearias';
import adminConvitesRoutes from './routes/admin/convites';
import adminUsuariosRoutes from './routes/admin/usuarios';
import criarExemploRoutes from './routes/admin/criar-exemplo';
import ativacaoRoutes from './routes/ativacao';
import authRoutes from './routes/auth';
import googleAuthRoutes from './routes/googleAuth';
import './config/passport';

// Carregar variáveis de ambiente
dotenv.config();

export const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Configuração de sessão para OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date().toISOString() });
});

// Rotas públicas (autenticação e ativação de conta)
app.use('/api/auth', authRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api', ativacaoRoutes);

// Rotas admin - ordem importa! Rotas mais específicas primeiro
app.use('/api/admin', criarExemploRoutes); // /api/admin/criar-exemplo
app.use('/api/admin', adminUsuariosRoutes); // /api/admin/barbearias/:id/dono
app.use('/api/admin', adminConvitesRoutes); // /api/admin/barbearias/:id/convite
app.use('/api/admin/barbearias', adminBarbeariasRoutes); // /api/admin/barbearias

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Health: http://localhost:${PORT}/api/health`);
});
