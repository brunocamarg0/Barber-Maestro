// Vercel serverless function que expõe o backend Express
// Isso permite que o backend rode na nuvem sem precisar rodar localmente

const { app } = require('../backend/dist/app.js');

// Exportar o app Express como serverless function
module.exports = app;

