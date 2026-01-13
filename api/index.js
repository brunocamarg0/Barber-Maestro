// Vercel serverless function - Wrapper para Express
// Permite que o backend Express rode na Vercel como serverless function

// Nota: Para usar na Vercel, você precisa:
// 1. Instalar: npm install @vercel/node --save-dev
// 2. Ou usar Railway/Render que são mais simples para Express

// Por enquanto, este arquivo é um placeholder
// A melhor solução é usar Railway ou Render para Express apps

module.exports = async (req, res) => {
  // Se estiver usando @vercel/node:
  // const { createServer } = require('@vercel/node');
  // const app = require('../backend/dist/app.js').app;
  // return createServer(app)(req, res);
  
  // Por enquanto, retorna erro informativo
  res.status(500).json({
    error: 'Backend não configurado para Vercel',
    message: 'Use Railway ou Render para deploy do Express, ou configure @vercel/node',
    alternatives: [
      'Railway: https://railway.app (mais fácil para Express)',
      'Render: https://render.com (gratuito)',
      'Local: npm run dev na pasta backend'
    ]
  });
};
