import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminBarbeariasRoutes from './routes/admin/barbearias';
import adminConvitesRoutes from './routes/admin/convites';
import adminUsuariosRoutes from './routes/admin/usuarios';
import ativacaoRoutes from './routes/ativacao';

// Carregar variáveis de ambiente
dotenv.config();

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date().toISOString() });
});

// Rotas públicas (ativação de conta)
app.use('/api', ativacaoRoutes);

// Rotas admin - ordem importa! Rotas mais específicas primeiro
app.use('/api/admin', adminUsuariosRoutes); // /api/admin/barbearias/:id/dono
app.use('/api/admin', adminConvitesRoutes); // /api/admin/barbearias/:id/convite
app.use('/api/admin/barbearias', adminBarbeariasRoutes); // /api/admin/barbearias

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Health: http://localhost:${PORT}/api/health`);
});
