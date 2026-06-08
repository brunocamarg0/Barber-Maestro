/**
 * Traduz mensagens de erro comuns (Supabase Auth, PostgREST, validações)
 * do inglês para o português. Se não houver tradução, retorna o original.
 */
const TRADUCOES: Array<{ match: RegExp | string; pt: string }> = [
  // ---- Auth ----
  { match: "Invalid login credentials", pt: "Email ou senha incorretos." },
  { match: "Invalid email or password", pt: "Email ou senha incorretos." },
  { match: /email not confirmed/i, pt: "Email ainda não confirmado. Verifique sua caixa de entrada." },
  { match: /user (already )?registered/i, pt: "Este email já está cadastrado." },
  { match: /already registered/i, pt: "Este email já está cadastrado." },
  { match: /already been registered/i, pt: "Este email já está cadastrado." },
  { match: /already exists/i, pt: "Este registro já existe." },
  { match: /user not found/i, pt: "Usuário não encontrado." },
  // ---- Senha ----
  { match: /password should be at least (\d+) characters?/i, pt: "A senha deve ter no mínimo $1 caracteres." },
  { match: /password should contain at least one character of each.*lowercase.*uppercase.*digits?.*symbols?/i, pt: "A senha deve conter letras minúsculas, maiúsculas, números e símbolos." },
  { match: /password should contain at least one (lowercase|uppercase|digit|number|symbol|special character)/i, pt: "A senha deve conter letras minúsculas, maiúsculas, números e símbolos." },
  { match: /password does not meet (the )?requirements/i, pt: "A senha não atende aos requisitos mínimos de segurança." },
  { match: /password is too short/i, pt: "A senha é muito curta." },
  { match: /password.*too long/i, pt: "A senha é muito longa." },
  { match: /password.*too weak/i, pt: "A senha é muito fraca. Use letras, números e símbolos." },
  { match: /weak password/i, pt: "Senha muito fraca. Use letras, números e símbolos." },
  { match: /password.*pwned|leaked password|compromised password|found in.*data breach|haveibeenpwned|hibp/i, pt: "Esta senha foi exposta em vazamentos. Escolha outra mais segura." },
  { match: /password is known to be weak.*easy to guess.*choose a different/i, pt: "Esta senha é conhecida por ser fraca e fácil de adivinhar. Escolha uma diferente." },
  { match: /known to be weak|easy to guess|commonly used password|password is too common/i, pt: "Esta senha é fraca e fácil de adivinhar. Escolha uma mais segura." },
  { match: /same password|new password.*same|password.*must be different/i, pt: "A nova senha deve ser diferente da anterior." },
  { match: /should be different from the old password/i, pt: "A nova senha deve ser diferente da anterior." },
  { match: /new password should be different/i, pt: "A nova senha deve ser diferente da anterior." },
  { match: /password.*do not match|passwords do not match/i, pt: "As senhas não coincidem." },
  { match: /password.*cannot be empty|password is required|password.*required/i, pt: "Senha obrigatória." },
  { match: /invalid password/i, pt: "Senha inválida." },
  { match: /incorrect password|wrong password/i, pt: "Senha incorreta." },
  { match: /password recovery requires.*email/i, pt: "Informe um email para recuperar a senha." },

  // ---- Email ----
  { match: /invalid email/i, pt: "Email inválido." },
  { match: /email address.*invalid/i, pt: "Email inválido." },
  { match: /unable to validate email address/i, pt: "Não foi possível validar o email." },
  { match: /signup.*disabled|signups not allowed/i, pt: "Cadastros estão temporariamente desativados." },
  { match: /email rate limit exceeded/i, pt: "Muitos emails enviados. Aguarde alguns minutos e tente novamente." },
  { match: /over.*email.*rate.*limit/i, pt: "Muitos emails enviados. Aguarde alguns minutos e tente novamente." },
  { match: /for security purposes.*request.*after (\d+) seconds?/i, pt: "Por segurança, aguarde $1 segundos antes de tentar novamente." },
  { match: /you can only request this (after|once every) (\d+) seconds?/i, pt: "Aguarde $2 segundos antes de tentar novamente." },
  { match: /rate limit/i, pt: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
  { match: /too many requests/i, pt: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
  { match: /too many.*attempts/i, pt: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
  { match: /token has expired|jwt expired|expired token/i, pt: "Sessão expirada. Faça login novamente." },
  { match: /invalid token|invalid jwt/i, pt: "Token inválido. Faça login novamente." },
  { match: /missing.*token/i, pt: "Sessão não encontrada. Faça login novamente." },
  { match: /not authenticated|auth session missing/i, pt: "Você precisa estar autenticado." },
  { match: /unauthorized/i, pt: "Acesso não autorizado." },
  { match: /forbidden/i, pt: "Acesso negado." },
  { match: /unsupported provider/i, pt: "Provedor de login não habilitado." },
  { match: /otp.*expired/i, pt: "Código expirado. Solicite um novo." },
  { match: /invalid otp|invalid code/i, pt: "Código inválido." },
  { match: /email.*required/i, pt: "Email obrigatório." },


  // ---- Banco / PostgREST ----
  { match: /duplicate key value/i, pt: "Já existe um registro com estes dados." },
  { match: /violates unique constraint/i, pt: "Já existe um registro com estes dados." },
  { match: /violates foreign key/i, pt: "Operação inválida: registro relacionado não encontrado." },
  { match: /violates not-null/i, pt: "Há campos obrigatórios não preenchidos." },
  { match: /violates check constraint/i, pt: "Dados inválidos para esta operação." },
  { match: /violates row-level security|new row violates/i, pt: "Você não tem permissão para esta operação." },
  { match: /permission denied/i, pt: "Você não tem permissão para esta operação." },
  { match: /row not found|no rows/i, pt: "Registro não encontrado." },
  { match: /JWS|JWT.*invalid/i, pt: "Sessão inválida. Faça login novamente." },

  // ---- Rede ----
  { match: /failed to fetch|networkerror|network request failed/i, pt: "Falha de conexão. Verifique sua internet e tente novamente." },
  { match: /timeout|timed out/i, pt: "A operação demorou demais. Tente novamente." },
  { match: /aborted/i, pt: "Operação cancelada." },
];

export function traduzirErro(mensagem?: string | null): string {
  if (!mensagem) return "Ocorreu um erro. Tente novamente.";
  const msg = String(mensagem).trim();
  if (!msg) return "Ocorreu um erro. Tente novamente.";

  for (const { match, pt } of TRADUCOES) {
    if (typeof match === "string") {
      if (msg.toLowerCase() === match.toLowerCase()) return pt;
      if (msg.toLowerCase().includes(match.toLowerCase())) return pt;
    } else if (match.test(msg)) {
      return msg.replace(match, pt);
    }
  }
  return msg;
}
