export interface StatusSistema {
  barbeariasOnline: number;
  agendamentosHoje: number;
  agendamentosTotal: number;
  usoModulos: UsoModulo[];
  errosSistema: ErroSistema[];
  logsCriticos: LogCritico[];
}

export interface UsoModulo {
  modulo: string;
  uso: number;
  percentual: number;
  periodo: string;
}

export interface ErroSistema {
  id: string;
  tipo: string;
  mensagem: string;
  data: string;
  severidade: "baixa" | "media" | "alta" | "critica";
  resolvido: boolean;
}

export interface LogCritico {
  id: string;
  tipo: string;
  mensagem: string;
  data: string;
  contexto?: Record<string, any>;
}

