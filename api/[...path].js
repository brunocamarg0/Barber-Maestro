// Catch-all route para todas as rotas da API
// Isso permite que todas as rotas do Express funcionem na Vercel

const { app } = require('../backend/dist/app.js');

// Exportar o app Express como serverless function
module.exports = app;

