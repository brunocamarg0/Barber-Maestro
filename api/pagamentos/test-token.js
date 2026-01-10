// Endpoint de teste para verificar se o token está configurado
// Use: GET /api/pagamentos/test-token

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  try {
    // Tentar buscar o token de diferentes formas
    const token1 = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const token2 = process.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
    
    const allEnvVars = Object.keys(process.env)
      .filter(key => key.includes('MERCADO') || key.includes('MP'))
      .reduce((obj, key) => {
        obj[key] = process.env[key] ? '***CONFIGURADO***' : 'NÃO CONFIGURADO';
        return obj;
      }, {});

    return res.status(200).json({
      success: true,
      diagnostic: {
        MERCADOPAGO_ACCESS_TOKEN: token1 ? '✅ Configurado' : '❌ Não configurado',
        VITE_MERCADOPAGO_ACCESS_TOKEN: token2 ? '✅ Configurado' : '❌ Não configurado',
        token1_length: token1 ? token1.length : 0,
        token2_length: token2 ? token2.length : 0,
        token1_prefix: token1 ? token1.substring(0, 10) + '...' : 'N/A',
        token2_prefix: token2 ? token2.substring(0, 10) + '...' : 'N/A',
        todas_variaveis_mercado: allEnvVars,
        node_env: process.env.NODE_ENV,
        vercel_env: process.env.VERCEL_ENV
      },
      message: token1 || token2 
        ? 'Token encontrado! ✅' 
        : 'Token NÃO encontrado! ❌ Configure MERCADOPAGO_ACCESS_TOKEN no Vercel'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

