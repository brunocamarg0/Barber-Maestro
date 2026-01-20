const API_URL = import.meta.env.VITE_API_URL || 'https://groom-guru-platform-production.up.railway.app/api';

export interface ApiError {
  error: string;
  message?: string;
}

/**
 * Função genérica para fazer requisições à API
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  const urlCompleta = `${API_URL}${endpoint}`;
  
  // Log detalhado para requisições DELETE (debug)
  if (options.method === 'DELETE') {
    console.log('🌐 [API REQUEST] DELETE:', urlCompleta);
    console.log('🌐 [API REQUEST] Method:', options.method);
    console.log('🌐 [API REQUEST] Token presente:', !!token);
  }
  
  const response = await fetch(urlCompleta, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: 'Erro na requisição',
    }));
    
    // Log detalhado de erros
    console.error('❌ [API REQUEST] Erro na requisição:');
    console.error('   URL:', urlCompleta);
    console.error('   Status:', response.status);
    console.error('   Status Text:', response.statusText);
    console.error('   Error:', error);
    
    // Se erro de autenticação, verificar se realmente é um problema de token
    // Não redirecionar imediatamente - pode ser um erro temporário ou de outra natureza
    if (response.status === 401) {
      const currentPath = window.location.pathname;
      const isPublicRoute = currentPath === '/' || currentPath === '/login' || currentPath === '/cadastro' || currentPath.startsWith('/funcionalidades');
      
      // Verificar se o token existe antes de remover
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      console.warn('⚠️ [API REQUEST] Erro 401 detectado');
      console.warn('   Path:', currentPath);
      console.warn('   Token presente:', !!token);
      console.warn('   UserType:', userType);
      console.warn('   Endpoint:', endpoint);
      console.warn('   Error message:', error.error || error.message);
      
      // Se não há token e está em rota pública, apenas lançar o erro
      if (!token && isPublicRoute) {
        throw new Error(error.error || error.message || 'Erro na requisição');
      }
      
      // Se há token mas a requisição falhou com 401, pode ser token expirado ou inválido
      // Mas não redirecionar imediatamente - pode ser um erro temporário
      // Apenas lançar o erro e deixar o componente tratar
      // Não limpar o token imediatamente - pode ser um problema de rede ou servidor
      
      // Só limpar e redirecionar se:
      // 1. Estiver em rota protegida (não pública)
      // 2. Não estiver já na página de login
      // 3. O erro indicar claramente que o token está inválido/expirado
      const errorMessage = (error.error || error.message || '').toLowerCase();
      const isTokenError = errorMessage.includes('token') || 
                          errorMessage.includes('expirado') || 
                          errorMessage.includes('inválido') ||
                          errorMessage.includes('autenticação');
      
      if (!isPublicRoute && !currentPath.includes('/login') && token && isTokenError) {
        console.error('❌ [API REQUEST] Token inválido/expirado detectado. Redirecionando para login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        localStorage.removeItem('barbearia');
        window.location.href = '/login?tab=owner';
        return; // Não lançar erro adicional, já está redirecionando
      }
      
      // Se não é claramente um erro de token, apenas lançar o erro
      // O componente pode tratar o erro de forma apropriada
    }
    
    // Para erros 404, incluir mais informações
    if (response.status === 404) {
      const mensagemErro = error.error || error.message || 'Rota não encontrada';
      const erroCompleto = new Error(mensagemErro);
      (erroCompleto as any).status = 404;
      (erroCompleto as any).url = urlCompleta;
      throw erroCompleto;
    }
    
    throw new Error(error.error || error.message || 'Erro na requisição');
  }

  return response.json();
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 */
export async function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}
